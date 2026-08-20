# Unit 07 Equation-Balancer Logic Patch

**Validated August 3, 2026**

## Issue corrected

The original atom-audit logic accepted all coefficients as zero because both sides then contained zero atoms. It also accepted balanced coefficient sets that had not been reduced to the lowest whole-number ratio.

## Corrected behavior

- Every coefficient must be a positive whole number of at least 1.
- Zero, negative, blank, and fractional coefficients cannot pass.
- Every atom type must have matching totals on both sides.
- A balanced multiple such as `4H₂ + 2O₂ → 4H₂O` is identified as reducible rather than fully complete.
- Success is reported only when coefficients are balanced and in the lowest whole-number ratio.
- Existing reaction records and correct default coefficients are unchanged.

## Replacement path

```text
courses/science/integrated-science-9/units/unit-07/equation-balancer.js
```

## Deployment checks

1. Set every coefficient to zero: the application must reject the entry.
2. Enter a fractional coefficient: the application must request positive whole numbers.
3. Enter `4, 2, 4` for water formation: atom counts match, but the application must request reduction by 2.
4. Enter `2, 1, 2`: the application must report success.
