// German average energy consumption data
export const germanHousehold = {
  singlePerson: {
    consumption: 1500,
    pricePerKwh: 0.35,
    expectedAnnualCost: 525,
  },
  familyOf4: {
    consumption: 4500,
    pricePerKwh: 0.35,
    expectedAnnualCost: 1575,
  },
  zeroConsumption: {
    consumption: 0,
    pricePerKwh: 0.35,
    expectedAnnualCost: 0,
  },
  maxConsumption: {
    consumption: 100000,
    pricePerKwh: 0.25,
    expectedAnnualCost: 25000,
  },
};

// CO2 emissions factors (Germany 2026)
export const co2Factors = {
  gridMix: 0.4,
  greenEnergy: 0.05,
};