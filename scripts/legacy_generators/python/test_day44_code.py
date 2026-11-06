# test_day44_code.py
from dataclasses import dataclass
from typing import Dict, List

class GroupDisclosuresEngine:
    def __init__(self, reporting_parent: str):
        self.reporting_parent = reporting_parent

    def format_material_nci_disclosure(
        self,
        subsidiary_name: str,
        nci_percentage: float,
        total_assets: float,
        total_liabilities: float,
        revenue: float,
        profit: float,
        restricted_cash_covenant: float
    ) -> Dict[str, float]:
        """Module 1: Ind AS 112 Paragraph 12 Material NCI Subsidiary Disclosures."""
        net_assets = total_assets - total_liabilities
        nci_share = nci_percentage / 100.0
        nci_carrying_equity = net_assets * nci_share
        nci_profit_share = profit * nci_share
        
        return {
            "subsidiary_name": subsidiary_name,
            "net_assets": round(net_assets, 2),
            "nci_equity_balance": round(nci_carrying_equity, 2),
            "nci_profit_allocated": round(nci_profit_share, 2),
            "restricted_cash_covenant": round(restricted_cash_covenant, 2)
        }

    def format_material_associate_disclosure(
        self,
        associate_name: str,
        ownership_pct: float,
        total_assets: float,
        total_liabilities: float,
        profit: float,
        oci: float,
        unrealized_profit_elim: float
    ) -> Dict[str, float]:
        """Module 2: Ind AS 112 Paragraph 21 Material Associate Disclosures."""
        net_assets = total_assets - total_liabilities
        share = ownership_pct / 100.0
        reconciled_carrying_value = (net_assets * share) - (unrealized_profit_elim * share)
        adj_share_profit = (profit * share) - (unrealized_profit_elim * share)
        adj_share_oci = oci * share
        
        return {
            "associate_name": associate_name,
            "investee_net_assets": round(net_assets, 2),
            "reconciled_carrying_value": round(reconciled_carrying_value, 2),
            "share_of_profit": round(adj_share_profit, 2),
            "share_of_oci": round(adj_share_oci, 2)
        }

    def format_unconsolidated_structured_entity(
        self,
        entity_name: str,
        total_entity_assets: float,
        subordinated_debt_held: float,
        liquidity_guarantee_limit: float
    ) -> Dict[str, float]:
        """Module 3: Ind AS 112 Paragraph 24-31 Unconsolidated Structured Entities Disclosures."""
        max_exposure = subordinated_debt_held + liquidity_guarantee_limit
        return {
            "entity_name": entity_name,
            "total_entity_size": round(total_entity_assets, 2),
            "carrying_value_asset": round(subordinated_debt_held, 2),
            "maximum_exposure_to_loss": round(max_exposure, 2)
        }

engine = GroupDisclosuresEngine("Phoenix Industrial Group Ltd")

nci_res = engine.format_material_nci_disclosure(
    subsidiary_name="Zenith Sensor Technologies Ltd",
    nci_percentage=20.0,
    total_assets=18000000.0,
    total_liabilities=6000000.0,
    revenue=20000000.0,
    profit=3000000.0,
    restricted_cash_covenant=1500000.0
)
assert nci_res["net_assets"] == 12000000.0
assert nci_res["nci_equity_balance"] == 2400000.0
assert nci_res["nci_profit_allocated"] == 600000.0
assert nci_res["restricted_cash_covenant"] == 1500000.0

assoc_res = engine.format_material_associate_disclosure(
    associate_name="Quantum Navigation Systems Ltd",
    ownership_pct=30.0,
    total_assets=25000000.0,
    total_liabilities=9000000.0,
    profit=1800000.0,
    oci=200000.0,
    unrealized_profit_elim=100000.0
)
assert assoc_res["investee_net_assets"] == 16000000.0
assert assoc_res["reconciled_carrying_value"] == 4770000.0
assert assoc_res["share_of_profit"] == 510000.0
assert assoc_res["share_of_oci"] == 60000.0

struct_res = engine.format_unconsolidated_structured_entity(
    entity_name="Aerospace Innovation Securitization Trust",
    total_entity_assets=50000000.0,
    subordinated_debt_held=2000000.0,
    liquidity_guarantee_limit=3000000.0
)
assert struct_res["total_entity_size"] == 50000000.0
assert struct_res["carrying_value_asset"] == 2000000.0
assert struct_res["maximum_exposure_to_loss"] == 5000000.0

print(f"Parent: {engine.reporting_parent}")
print(f"Material NCI ({nci_res['subsidiary_name']}): NCI Equity: ${nci_res['nci_equity_balance']:,.2f} | Restricted Cash: ${nci_res['restricted_cash_covenant']:,.2f}")
print(f"Material Associate ({assoc_res['associate_name']}): Carrying Value: ${assoc_res['reconciled_carrying_value']:,.2f} | Share of P&L: ${assoc_res['share_of_profit']:,.2f}")
print(f"Structured Entity ({struct_res['entity_name']}): Size: ${struct_res['total_entity_size']:,.2f} | Max Loss Exposure: ${struct_res['maximum_exposure_to_loss']:,.2f}")
print("IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS")
