---
title: Risks and limitations
description: What our prototype is missing.
---

## What the prototype does not do

### Requirements we did not meet

The following features were planned but not implemented due to time constraints:

1. **Case studies:** We had originally planned to include a few case studies covering real-world applications of AVL trees. This would have been ideal for students who prefer a more practical approach to learning. It was not developed due to the massive time sink involved in creating the content and storyboards for them.
2. **Share a link to a tree:** A "nice-to-have" feature that we originally planned for was to make the playground shareable. A student would be able to invite a friend to their playground session where they could interact with the trees together. The blocker preventing us from developing this feature was deployment, as we did not have time to deploy our application.
3. **Streaks:** A daily login or practice streak would have motivated students to practise daily. Time limits are what prevented us from developing these.

### Other limits

- Account emails are not verified and there is no password reset.
- The application could not be tested with real COS212 students.
- None of the pages have been tested with Google Lighthouse.
- Support, such as hints, is never removed for strong learners.
- The Listen feature uses the browser's voice; recorded snippets would have been higher quality.

## Risks

| Risk                        | How we handled it                                                        |
| --------------------------- | ------------------------------------------------------------------------ |
| One three-week sprint       | Must requirements were focused on first, and case studies were dropped. |
| Tests written with AI tools | All code changes (including tests) were reviewed by a human developer.   |
| No end-to-end tests         | The application was manually tested on every MR.                         |

## What our next focus would be

1. Deploying the application.
2. Testing with real students and tuning lessons and tests based on feedback.
3. Building the case studies and the shareable playground feature.
4. Adjusting support for strong learners.
5. Recording voice over content ourselves.
6. Developing password reset and email verification features.
