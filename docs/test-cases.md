# Test Cases - OrangeHRM UI E2E

## Coverage Summary

| Module | Coverage |
|---|---|
| Employee | Create, Read, Update, Delete |
| Leave Type | Create, Read, Update, Delete |
| Claim Event | Create, Read, Update, Delete |
| Claim Self | Create, Read, Update, Delete / Cancel |

---

## Employee Test Cases

| Test Case ID | Feature / Area | Pre-condition | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|
| TC_EMP_001 | Create Employee | Admin is logged in and PIM module is available | Navigate to PIM. Click Add Employee. Enter employee details. Save the record. | Unique first name, middle name, last name | Employee is created and visible in the employee list. | Automated |
| TC_EMP_002 | Read Employee | Employee record exists | Navigate to Employee List. Search/read the employee record. | Existing employee name or ID | Employee details are visible. | Automated |
| TC_EMP_003 | Update Employee | Employee record exists | Open employee record. Update editable information. Save changes. | Updated employee data | Updated information is saved and visible. | Automated |
| TC_EMP_004 | Delete Employee | Employee record exists | Search employee. Delete employee. Confirm deletion. | Existing employee record | Employee is removed from the list. | Automated |

---

## Leave Type Test Cases

| Test Case ID | Feature / Area | Pre-condition | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|
| TC_LEAVE_001 | Create Leave Type | Admin is logged in and Leave module is available | Navigate to Leave Types. Click Add. Enter leave type name. Save. | Unique leave type name | Leave type is created and visible in the list. | Automated |
| TC_LEAVE_002 | Read Leave Type | Leave Type page is accessible | Navigate to Leave Types. Verify page heading and table structure. | Existing leave type data | Leave Types page and table columns are visible. | Automated |
| TC_LEAVE_003 | Update Leave Type | Leave type exists | Open existing leave type. Update name. Save changes. | Updated unique leave type name | Updated leave type is visible in the list. | Automated |
| TC_LEAVE_004 | Delete Leave Type | Leave type exists | Select leave type. Delete it. Confirm deletion. | Existing leave type name | Leave type is removed from the list. | Automated |

---

## Claim Event Test Cases

| Test Case ID | Feature / Area | Pre-condition | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|
| TC_EVENT_001 | Create Event | Admin is logged in and Claim module is available | Navigate to Claim Events. Click Add. Enter event name and description. Save. | Unique event name and description | Event is created and visible in the event list. | Automated |
| TC_EVENT_002 | Read Event | Event exists | Navigate to Events. Search/read the event. | Existing event name | Event row is visible and active. | Automated |
| TC_EVENT_003 | Update Event | Event exists | Open event edit form. Update event name. Save changes. | Updated unique event name | Updated event is visible in the event list. | Automated |
| TC_EVENT_004 | Delete Event | Event exists | Delete event. Confirm deletion. | Existing event name | Event is removed from the event list. | Automated |

---

## Claim Self Test Cases

| Test Case ID | Feature / Area | Pre-condition | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|
| TC_CLAIM_001 | Create Claim | Claim event exists and Submit Claim page is available | Select event and currency. Create claim. Add expenses. Upload receipt if needed. Submit claim. | Event, Bangladeshi Taka, expenses, receipt file | Claim is created/submitted and visible in My Claims. | Automated |
| TC_CLAIM_002 | Read Claim | Claim exists | Navigate to My Claims. Open/view claim details. | Existing claim | Claim details and total amount are visible. | Automated |
| TC_CLAIM_003 | Update Claim | Draft claim exists | Add another expense to draft claim. Verify updated total amount. | Additional expense amount | Draft claim total amount is updated correctly. | Automated |
| TC_CLAIM_004 | Delete / Cancel Claim | Submitted claim exists | Open claim details. Cancel claim. Verify status. | Existing submitted claim | Claim status changes to Cancelled. | Automated |

---

## Cleanup Strategy

- Test data uses unique timestamp/random suffixes to reduce duplicate data collisions.
- Delete and cancel flows are automated where the OrangeHRM UI supports them.
- Some created records may remain in the local test database if the UI does not support hard deletion.
- CI artifacts include reports, traces, and videos to support debugging.

---

## Notes and Assumptions

- Tests are designed for a local OrangeHRM instance.
- Tests use admin credentials from `.env` locally and GitHub Secrets in CI.
- Default OrangeHRM data such as claim expense types and currency options are assumed to be available.
- Claim delete is treated as claim cancellation where the UI supports cancellation instead of hard deletion.