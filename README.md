Software Testing Lab 6 updated to include automated pipeline for Lab 7


Unit Tests run every time that a push or pull touches the main branch. This is mostly to ensure that new code introduced to or from main doesn't have unintended consequences for other unit tests (i.e. what we talked about in class - two entirely different systems pull from the same base, but changing the base for one might introduce a cascade of problems for the sister branch)

Integration Tests run nightly to ensure that the larger pieces of the program are still able to communicate with each other after any changes made through the day (making sure that API contracts are still in place, schema validations, anything of that nature). This is not ran during the workday on purpose; a partially-complete implementation of an update should not trigger a gigantic warning for the entire system if the rest of the update is planned for later that day (not interrupting regular workflow for users)

e2e Tests run weekly; they will have a very long processing time - don't want to bog down the build queue with a test of the entire system during the work week, and especially not during a workday. If anything catches on fire or explodes on a Sunday afternoon, then the developers will know what to work on Monday morning.

