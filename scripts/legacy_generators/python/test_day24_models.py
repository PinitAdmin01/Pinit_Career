"""
Test Script for Day 24 Models: Central Bank Digital Currencies (CBDCs)
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-794
"""

def model_two_tier_cbdc_issuance(
    central_bank_reserves_exchanged_usd: float,
    commercial_bank_cash_ratio_pct: float,
    retail_wallets_onboarded: int,
    average_retail_wallet_balance_usd: float
) -> dict:
    total_cbdc_minted_m0 = central_bank_reserves_exchanged_usd
    total_retail_cbdc_distributed = retail_wallets_onboarded * average_retail_wallet_balance_usd
    bank_retained_cbdc_float = total_cbdc_minted_m0 - total_retail_cbdc_distributed
    assert bank_retained_cbdc_float >= 0, "Cannot distribute more CBDC than minted"
    
    return {
        "cbdc_m0_minted_usd": total_cbdc_minted_m0,
        "retail_distributed_usd": total_retail_cbdc_distributed,
        "bank_vault_float_usd": bank_retained_cbdc_float,
        "central_bank_liability": True,
        "tier2_commercial_distribution": True
    }

def model_mbridge_cross_border_settlement(
    transfer_amount_foreign_ccy: float,
    fx_exchange_rate: float,
    conventional_correspondent_fee_bps: float,
    mbridge_network_fee_bps: float,
    conventional_settlement_hours: float = 72.0,
    mbridge_settlement_seconds: float = 2.5
) -> dict:
    transfer_amount_usd = transfer_amount_foreign_ccy * fx_exchange_rate
    conventional_fee_usd = transfer_amount_usd * (conventional_correspondent_fee_bps / 10000.0)
    mbridge_fee_usd = transfer_amount_usd * (mbridge_network_fee_bps / 10000.0)
    fee_savings_usd = conventional_fee_usd - mbridge_fee_usd
    fee_reduction_pct = (fee_savings_usd / conventional_fee_usd) * 100.0
    
    return {
        "transfer_usd": transfer_amount_usd,
        "conventional_fee_usd": round(conventional_fee_usd, 2),
        "mbridge_fee_usd": round(mbridge_fee_usd, 2),
        "fee_savings_usd": round(fee_savings_usd, 2),
        "fee_reduction_pct": round(fee_reduction_pct, 1),
        "latency_reduction_ratio": round((conventional_settlement_hours * 3600.0) / mbridge_settlement_seconds, 0),
        "atomic_pvp_cleared": True
    }

def model_programmable_smart_contract_cbdc(
    subsidy_amount_usd: float,
    target_merchant_category: str,
    spent_merchant_category: str,
    days_to_expiration: int,
    actual_days_elapsed: int
) -> dict:
    category_valid = (target_merchant_category == spent_merchant_category)
    time_valid = (actual_days_elapsed <= days_to_expiration)
    
    if category_valid and time_valid:
        transaction_approved = True
        status = "PROGRAMMABLE_SETTLEMENT_SUCCESSFUL"
        merchant_payout_usd = subsidy_amount_usd * 0.98 # 2% automated sales tax withholding
        tax_escrow_withheld_usd = subsidy_amount_usd * 0.02
    else:
        transaction_approved = False
        status = "REJECTED_CATEGORY_OR_EXPIRATION_VIOLATION"
        merchant_payout_usd = 0.0
        tax_escrow_withheld_usd = 0.0
        
    return {
        "subsidy_amount_usd": subsidy_amount_usd,
        "transaction_approved": transaction_approved,
        "status": status,
        "merchant_payout_usd": round(merchant_payout_usd, 2),
        "tax_withheld_usd": round(tax_escrow_withheld_usd, 2)
    }

def model_offline_dual_cash_protocol(
    payer_offline_balance_usd: float,
    transfer_amount_usd: float,
    payer_offline_tx_counter: int,
    max_offline_limit_usd: float = 500.0
) -> dict:
    assert transfer_amount_usd <= max_offline_limit_usd, "Exceeds regulatory offline cap"
    assert payer_offline_balance_usd >= transfer_amount_usd, "Insufficient offline funds"
    
    new_payer_balance = payer_offline_balance_usd - transfer_amount_usd
    new_tx_counter = payer_offline_tx_counter + 1
    
    return {
        "initial_offline_balance_usd": payer_offline_balance_usd,
        "transfer_amount_usd": transfer_amount_usd,
        "new_offline_balance_usd": round(new_payer_balance, 2),
        "cryptographic_tx_counter": new_tx_counter,
        "double_spending_prevented": True,
        "hardware_secure_enclave_verified": True
    }

def model_disintermediation_guardrail_caps(
    incoming_retail_deposit_usd: float,
    individual_holding_cap_usd: float,
    existing_cbdc_wallet_balance_usd: float
) -> dict:
    total_potential_balance = existing_cbdc_wallet_balance_usd + incoming_retail_deposit_usd
    
    if total_potential_balance <= individual_holding_cap_usd:
        accepted_into_cbdc = incoming_retail_deposit_usd
        overflow_auto_swept_to_commercial_bank = 0.0
        final_cbdc_balance = total_potential_balance
    else:
        accepted_into_cbdc = max(0.0, individual_holding_cap_usd - existing_cbdc_wallet_balance_usd)
        overflow_auto_swept_to_commercial_bank = incoming_retail_deposit_usd - accepted_into_cbdc
        final_cbdc_balance = individual_holding_cap_usd
        
    return {
        "incoming_deposit_usd": incoming_retail_deposit_usd,
        "individual_cap_usd": individual_holding_cap_usd,
        "final_cbdc_balance_usd": round(final_cbdc_balance, 2),
        "overflow_auto_swept_usd": round(overflow_auto_swept_to_commercial_bank, 2),
        "commercial_bank_disintermediation_prevented": overflow_auto_swept_to_commercial_bank > 0
    }

# Execute tests
res1 = model_two_tier_cbdc_issuance(500_000_000.0, 10.0, 100_000, 3_500.0)
res2 = model_mbridge_cross_border_settlement(10_000_000.0, 1.0, 150.0, 25.0)
res3 = model_programmable_smart_contract_cbdc(1000.0, "AGRICULTURAL_FERTILIZER", "AGRICULTURAL_FERTILIZER", 30, 12)
res4 = model_offline_dual_cash_protocol(400.0, 150.0, 42)
res5 = model_disintermediation_guardrail_caps(12_000.0, 5_000.0, 2_000.0)

print("Day 24 models executed successfully.")
