# Canonical Signed Record Specification

Public-safe canonical record and verification contract. Private signing custody and operational key-management material are intentionally excluded from this learner repository.

## Signature scope

The ECDSA signature covers **only** the `record` object in a signed-record package. The outer `schemaVersion` and `signature` object are not included in the signed bytes.

## Canonicalization

Before signing or verification:

1. Preserve JSON primitive values exactly by type.
2. Preserve array order.
3. For every object, sort property names lexicographically.
4. Apply the same rule recursively to nested objects.
5. Serialize with JSON string escaping and no insignificant whitespace.
6. Encode the resulting string as UTF-8.

The signer and public verifier implement the same recursive canonicalization function.

## Algorithm

- Key type: ECDSA
- Curve: P-256 / prime256v1 / secp256r1
- Hash: SHA-256
- Signature label: `ECDSA-P256-SHA256`
- Signature transport encoding: base64url without padding

## Key identifier

The signer derives the key ID from SHA-256 of the canonical public JWK subset:

```json
{"crv":"P-256","kty":"EC","x":"...","y":"..."}
```

The first 22 base64url characters of that digest are prefixed with `KAA-`.

## Required signed record fields

- `recordId`
- `learnerId`
- `courseCode`
- `courseTitle`
- `academicYear`
- `completionDate`
- `finalPercent`
- `assessmentVersion`
- `issuedAt`

Optional signed fields include `learnerName`, `letterGrade`, `credit`, and `issuer`.

## Trust rule

A valid signature proves that the exact signed record matches a recognized Academy public key. It does not prove that an unsigned browser-local score was independently authoritative before an administrator reviewed and issued the signed record.

## Private-key rule

The private signing key must never be committed to Git, placed in a public repository, embedded in browser-delivered public code, or copied into public documentation. The encrypted vault export is an offline custody artifact and is excluded by `.gitignore`.
