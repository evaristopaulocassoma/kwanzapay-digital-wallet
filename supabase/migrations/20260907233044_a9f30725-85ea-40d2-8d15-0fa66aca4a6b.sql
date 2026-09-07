CREATE OR REPLACE FUNCTION public.perform_deposit(p_user UUID, p_currency TEXT, p_amount NUMERIC, p_description TEXT DEFAULT NULL)
RETURNS public.transactions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_wallet public.wallets; v_tx public.transactions;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'invalid_amount'; END IF;
  INSERT INTO public.wallets (user_id, currency) VALUES (p_user, p_currency)
    ON CONFLICT (user_id, currency) DO NOTHING;
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user AND currency = p_currency FOR UPDATE;
  UPDATE public.wallets SET balance = balance + p_amount WHERE id = v_wallet.id RETURNING * INTO v_wallet;
  INSERT INTO public.transactions (user_id, type, status, currency, amount, description)
    VALUES (p_user, 'deposit', 'completed', p_currency, p_amount, p_description) RETURNING * INTO v_tx;
  INSERT INTO public.ledger_entries (transaction_id, wallet_id, user_id, direction, currency, amount, balance_after)
    VALUES (v_tx.id, v_wallet.id, p_user, 'credit', p_currency, p_amount, v_wallet.balance);
  RETURN v_tx;
END; $$;

CREATE OR REPLACE FUNCTION public.perform_transfer(p_sender UUID, p_recipient_email TEXT, p_currency TEXT, p_amount NUMERIC, p_description TEXT DEFAULT NULL)
RETURNS public.transactions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_recipient UUID; v_sw public.wallets; v_rw public.wallets; v_tx public.transactions; v_rx public.transactions;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'invalid_amount'; END IF;
  SELECT id INTO v_recipient FROM auth.users WHERE lower(email) = lower(p_recipient_email) LIMIT 1;
  IF v_recipient IS NULL THEN RAISE EXCEPTION 'recipient_not_found'; END IF;
  IF v_recipient = p_sender THEN RAISE EXCEPTION 'self_transfer'; END IF;

  SELECT * INTO v_sw FROM public.wallets WHERE user_id = p_sender AND currency = p_currency FOR UPDATE;
  IF v_sw.id IS NULL OR v_sw.balance < p_amount THEN RAISE EXCEPTION 'insufficient_funds'; END IF;

  INSERT INTO public.wallets (user_id, currency) VALUES (v_recipient, p_currency) ON CONFLICT (user_id, currency) DO NOTHING;
  SELECT * INTO v_rw FROM public.wallets WHERE user_id = v_recipient AND currency = p_currency FOR UPDATE;

  UPDATE public.wallets SET balance = balance - p_amount WHERE id = v_sw.id RETURNING * INTO v_sw;
  UPDATE public.wallets SET balance = balance + p_amount WHERE id = v_rw.id RETURNING * INTO v_rw;

  INSERT INTO public.transactions (user_id, counterparty_user_id, type, status, currency, amount, description)
    VALUES (p_sender, v_recipient, 'send', 'completed', p_currency, p_amount, p_description) RETURNING * INTO v_tx;
  INSERT INTO public.transactions (user_id, counterparty_user_id, type, status, currency, amount, description, metadata)
    VALUES (v_recipient, p_sender, 'receive', 'completed', p_currency, p_amount, p_description, jsonb_build_object('linked_transaction', v_tx.id)) RETURNING * INTO v_rx;

  INSERT INTO public.ledger_entries (transaction_id, wallet_id, user_id, direction, currency, amount, balance_after)
    VALUES (v_tx.id, v_sw.id, p_sender, 'debit', p_currency, p_amount, v_sw.balance),
           (v_rx.id, v_rw.id, v_recipient, 'credit', p_currency, p_amount, v_rw.balance);
  RETURN v_tx;
END; $$;

CREATE OR REPLACE FUNCTION public.request_withdrawal(p_user UUID, p_currency TEXT, p_amount NUMERIC, p_destination TEXT)
RETURNS public.transactions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_w public.wallets; v_tx public.transactions;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'invalid_amount'; END IF;
  SELECT * INTO v_w FROM public.wallets WHERE user_id = p_user AND currency = p_currency FOR UPDATE;
  IF v_w.id IS NULL OR v_w.balance < p_amount THEN RAISE EXCEPTION 'insufficient_funds'; END IF;
  UPDATE public.wallets SET balance = balance - p_amount WHERE id = v_w.id RETURNING * INTO v_w;
  INSERT INTO public.transactions (user_id, type, status, currency, amount, description, metadata)
    VALUES (p_user, 'withdrawal', 'pending', p_currency, p_amount, 'Levantamento', jsonb_build_object('destination', p_destination))
    RETURNING * INTO v_tx;
  INSERT INTO public.ledger_entries (transaction_id, wallet_id, user_id, direction, currency, amount, balance_after)
    VALUES (v_tx.id, v_w.id, p_user, 'debit', p_currency, p_amount, v_w.balance);
  RETURN v_tx;
END; $$;

REVOKE EXECUTE ON FUNCTION public.perform_deposit(UUID, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.perform_transfer(UUID, TEXT, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_withdrawal(UUID, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.perform_deposit(UUID, TEXT, NUMERIC, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.perform_transfer(UUID, TEXT, TEXT, NUMERIC, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(UUID, TEXT, NUMERIC, TEXT) TO service_role;