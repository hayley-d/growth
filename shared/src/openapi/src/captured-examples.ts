export const capturedRequests: Record<string, unknown> = {
  signUpWithEmail: { email: "ada@example.com", password: "a-long-passphrase", name: "Ada" },
  signInWithEmail: { email: "ada@example.com", password: "a-long-passphrase" },
  scoreQuiz: {
    answers: [
      { questionId: "flat-pack-desk", optionId: "a" },
      { questionId: "new-place", optionId: "a" },
      { questionId: "board-game", optionId: "a" },
      { questionId: "new-dish", optionId: "a" },
      { questionId: "remember-for-test", optionId: "a" },
      { questionId: "new-app", optionId: "a" },
      { questionId: "new-phone", optionId: "a" },
      { questionId: "explain-to-friend", optionId: "a" },
    ],
  },
  completeOnboarding: {
    learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
    codeLanguageId: "f61727a9-b2e3-426b-a4df-8451c4969d75",
    showOnLeaderboard: true,
    textToSpeech: false,
  },
  updateProfile: { colourTheme: "high-contrast", textToSpeech: true },
  saveLessonNote: {
    body: "In-order gives sorted keys because the left subtree, with the smaller keys, is always visited first.",
  },
  requestHint: { questionId: "75a85d53-20a6-409a-b5c0-40b971108c89" },
  submitAnswer: {
    questionId: "75a85d53-20a6-409a-b5c0-40b971108c89",
    answer: { type: "text", text: "I am not sure" },
  },
  startPractice: { topic: "traversals" },
  submitDailyChallengeAnswer: {
    questionId: "94688f6d-98d0-4055-bd45-27e35efd1d9e",
    answer: { type: "text", text: "I am not sure" },
  },
};
export const capturedResponses: Record<string, unknown> = {
  "getLeaderboard:200": {
    data: {
      top: [
        { rank: 1, displayName: "Ada", timeSeconds: 41, points: 100, isMe: true },
        { rank: 2, displayName: "Grace", timeSeconds: 55, points: 100, isMe: false },
        { rank: 3, displayName: "Alan", timeSeconds: 72, points: 80, isMe: false },
      ],
      me: {
        displayName: "Ada",
        rank: 1,
        timeSeconds: 41,
        points: 100,
        passed: true,
        hidden: false,
      },
    },
  },
  "getHealth:200": { status: "ok" },
  "signUpWithEmail:400": { message: "Password too short", code: "PASSWORD_TOO_SHORT" },
  "signUpWithEmail:200": {
    token: "Qm4xZ9tR2vYb7LkP0cWd3HsNe8UaJf5T",
    user: {
      name: "Ada",
      email: "ada@example.com",
      emailVerified: false,
      image: null,
      createdAt: "2026-11-14T10:22:23.180Z",
      updatedAt: "2026-11-14T10:22:23.180Z",
      role: "student",
      banned: false,
      banReason: null,
      banExpires: null,
      id: "8hkwkc0tIvqxB220DLvFkXoFwdqMlFwr",
    },
  },
  "signUpWithEmail:422": {
    message: "User already exists. Use another email.",
    code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
  },
  "signInWithEmail:401": {
    message: "Invalid email or password",
    code: "INVALID_EMAIL_OR_PASSWORD",
  },
  "signInWithEmail:403": { message: "Invalid origin", code: "INVALID_ORIGIN" },
  "signInWithEmail:200": {
    redirect: false,
    token: "Qm4xZ9tR2vYb7LkP0cWd3HsNe8UaJf5T",
    user: {
      name: "Ada",
      email: "ada@example.com",
      emailVerified: false,
      image: null,
      createdAt: "2026-11-14T10:22:23.180Z",
      updatedAt: "2026-11-14T10:22:23.180Z",
      role: "student",
      banned: false,
      banReason: null,
      banExpires: null,
      id: "8hkwkc0tIvqxB220DLvFkXoFwdqMlFwr",
    },
  },
  "getSession:200": {
    session: {
      id: "natUmrCe6EhiXnDa71hVWphuuVbtvqIX",
      createdAt: "2026-11-14T10:22:23.478Z",
      updatedAt: "2026-11-14T10:22:23.478Z",
      userId: "8hkwkc0tIvqxB220DLvFkXoFwdqMlFwr",
      expiresAt: "2026-11-21T10:22:23.478Z",
      token: "Qm4xZ9tR2vYb7LkP0cWd3HsNe8UaJf5T",
      ipAddress: "",
      userAgent: "Bun/1.4.2",
      impersonatedBy: null,
    },
    user: {
      id: "8hkwkc0tIvqxB220DLvFkXoFwdqMlFwr",
      createdAt: "2026-11-14T10:22:23.180Z",
      updatedAt: "2026-11-14T10:22:23.180Z",
      email: "ada@example.com",
      emailVerified: false,
      name: "Ada",
      image: null,
      role: "student",
      banned: false,
      banReason: null,
      banExpires: null,
    },
  },
  "listAlgorithms:200": {
    data: {
      algorithms: [
        { code: "insert", name: "Insert" },
        { code: "delete", name: "Delete" },
        { code: "search", name: "Search" },
        { code: "rotate-left", name: "Rotate left" },
        { code: "rotate-right", name: "Rotate right" },
        { code: "rebalance", name: "Rebalance" },
        { code: "update-height", name: "Update height and balance" },
        { code: "preorder", name: "Pre-order traversal" },
        { code: "inorder", name: "In-order traversal" },
        { code: "postorder", name: "Post-order traversal" },
        { code: "levelorder", name: "Level-order traversal" },
      ],
    },
  },
  "getAlgorithmSnippet:200": {
    data: {
      algorithm: { code: "inorder", name: "In-order traversal" },
      language: { code: "pseudocode", name: "Pseudocode" },
      source:
        "inorder(node):\n  if node is empty: return\n  inorder(node.left)\n  visit(node)\n  inorder(node.right)\n",
      lines: {
        "inorder.check-empty": 2,
        "inorder.empty": 2,
        "inorder.go-left": 3,
        "inorder.visit": 4,
        "inorder.go-right": 5,
      },
    },
  },
  "listLearningStyles:200": {
    data: {
      learningStyles: [
        {
          id: "4ac1818e-597d-426b-8b76-30ec1a315715",
          name: "Auditory",
          description: "You learn best by listening, so lesson steps can be read aloud to you.",
        },
        {
          id: "9e9ff00d-8cbc-4d33-8556-e47592d20399",
          name: "Kinesthetic",
          description:
            "You learn best by doing: building trees and trying things in the playground.",
        },
        {
          id: "06b78874-c446-4653-89c8-87da6878f00f",
          name: "Reading/writing",
          description:
            "You learn best from written explanations and putting ideas in your own words.",
        },
        {
          id: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
          name: "Visual",
          description: "You learn best from diagrams, animations and watching the tree change.",
        },
      ],
    },
  },
  "listCodeLanguages:200": {
    data: {
      codeLanguages: [
        { id: "ed6b9ead-e559-4cf9-ae79-d783bfd05344", code: "java", name: "Java" },
        { id: "f61727a9-b2e3-426b-a4df-8451c4969d75", code: "pseudocode", name: "Pseudocode" },
        { id: "715c607e-15bd-4f07-b782-98a5c345b1f6", code: "rust", name: "Rust" },
      ],
    },
  },
  "getQuiz:200": {
    data: {
      questions: [
        {
          id: "flat-pack-desk",
          prompt: "Your new desk arrives flat in a box. What do you grab first?",
          options: [
            { id: "a", text: "The picture instructions" },
            { id: "b", text: "Someone to read the steps out while you build" },
            { id: "c", text: "The written steps, so you can read them all first" },
            { id: "d", text: "The screwdriver. You'll work it out" },
          ],
        },
        {
          id: "new-place",
          prompt:
            "A friend invites you over. You've never been to their place. How do you get there?",
          options: [
            { id: "a", text: "Phone them and ask them to explain the way" },
            { id: "b", text: "Ask them to send the directions in a message" },
            { id: "c", text: "Head out and figure it out on the way" },
            { id: "d", text: "Look at the route on a map before you leave" },
          ],
        },
        {
          id: "board-game",
          prompt: "New board game. Where do you start?",
          options: [
            { id: "a", text: "The rule book" },
            { id: "b", text: "A practice round, and you learn from your mistakes" },
            { id: "c", text: "Watching the others play a round first" },
            { id: "d", text: "Someone who's played before explaining it" },
          ],
        },
        {
          id: "new-dish",
          prompt: "You want to cook something you've never made. What do you look for?",
          options: [
            { id: "a", text: "Nothing much. You'll taste and adjust as you go" },
            { id: "b", text: "A video of someone making it" },
            { id: "c", text: "A voice note from someone who makes it often" },
            { id: "d", text: "A written recipe with the amounts" },
          ],
        },
        {
          id: "remember-for-test",
          prompt: "There's a test tomorrow. How do you study?",
          options: [
            { id: "a", text: "Draw diagrams or a mind map" },
            { id: "b", text: "Say it out loud, or explain it to a friend" },
            { id: "c", text: "Rewrite your notes in your own words" },
            { id: "d", text: "Work through practice questions" },
          ],
        },
        {
          id: "new-app",
          prompt: "You download an app you've never used. What now?",
          options: [
            { id: "a", text: "Ask a friend who uses it to tell you how it works" },
            { id: "b", text: "Read the help page" },
            { id: "c", text: "Tap around until it clicks" },
            { id: "d", text: "Look through the screenshots first" },
          ],
        },
        {
          id: "new-phone",
          prompt: "Your old phone is dying and you need a new one. How do you choose?",
          options: [
            { id: "a", text: "Read reviews and spec sheets" },
            { id: "b", text: "Hold a few in a shop and try them" },
            { id: "c", text: "Compare photos and side by side charts" },
            { id: "d", text: "Ask friends what they think of theirs" },
          ],
        },
        {
          id: "explain-to-friend",
          prompt: "A friend asks how something works. You know it well. What do you do?",
          options: [
            { id: "a", text: "Show them, then let them have a go" },
            { id: "b", text: "Grab some paper and sketch it" },
            { id: "c", text: "Talk them through it" },
            { id: "d", text: "Write it out for them step by step" },
          ],
        },
      ],
    },
  },
  "scoreQuiz:200": {
    data: {
      learningStyle: {
        id: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
        name: "Visual",
        description: "You learn best from diagrams, animations and watching the tree change.",
      },
    },
  },
  "completeOnboarding:200": {
    data: {
      user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
      profile: {
        codeLanguageId: "f61727a9-b2e3-426b-a4df-8451c4969d75",
        colourTheme: "default",
        learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
        onboardingComplete: true,
        showOnLeaderboard: true,
        textToSpeech: false,
      },
    },
  },
  "getMe:200": {
    data: {
      user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
      profile: {
        codeLanguageId: "f61727a9-b2e3-426b-a4df-8451c4969d75",
        colourTheme: "default",
        learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
        onboardingComplete: true,
        showOnLeaderboard: true,
        textToSpeech: false,
      },
    },
  },
  "updateProfile:200": {
    data: {
      user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
      profile: {
        codeLanguageId: "f61727a9-b2e3-426b-a4df-8451c4969d75",
        colourTheme: "high-contrast",
        learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
        onboardingComplete: true,
        showOnLeaderboard: true,
        textToSpeech: true,
      },
    },
  },
  "getLearningPath:200": {
    data: {
      units: [
        {
          id: "7a333dd1-be52-5dd9-b910-edcebc7ca6b5",
          title: "Binary trees and traversals",
          position: 1,
          progress: 33,
          lessons: [
            {
              id: "1d068eae-51c6-51f5-96f4-e88ecd0ded00",
              title: "What is a binary tree",
              summary:
                "Learn the words for a binary tree and the rule that keeps a search tree in order.",
              kind: "lesson",
              position: 1,
              status: "completed",
              mastery: 0,
            },
            {
              id: "41f0afbe-6043-5a28-9f20-1d1a239fef77",
              title: "Pre-order",
              summary: "Visit the node first, then its left and right subtrees.",
              kind: "lesson",
              position: 2,
              status: "completed",
              mastery: 0,
            },
            {
              id: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
              title: "In-order",
              summary: "Visit the left subtree, then the node, then the right subtree.",
              kind: "lesson",
              position: 3,
              status: "current",
              mastery: 0,
            },
            {
              id: "59403f22-d038-53bf-8c1c-b2662bbc738c",
              title: "Post-order",
              summary: "Visit both subtrees first and the node last.",
              kind: "lesson",
              position: 4,
              status: "locked",
              mastery: 0,
            },
            {
              id: "37b0ab85-18f7-52e0-a66f-c66bd8bfd6f7",
              title: "Level-order",
              summary: "Visit the tree one level at a time, from the top down.",
              kind: "lesson",
              position: 5,
              status: "locked",
              mastery: 0,
            },
            {
              id: "90d14ff2-7001-5a25-8a76-1786b88345ff",
              title: "Traversal checkpoint",
              summary: "A short quiz to check you can tell the four traversals apart.",
              kind: "checkpoint",
              position: 6,
              status: "locked",
              mastery: 0,
            },
          ],
        },
        {
          id: "ed4b7c66-4f86-513b-82a5-a65cc9c7637c",
          title: "AVL trees",
          position: 2,
          progress: 0,
          lessons: [
            {
              id: "06bc480f-13a1-5417-83b8-84ed609b847e",
              title: "Height and balance factor",
              summary:
                "See why a stick tree is slow and work out each node's height and balance factor.",
              kind: "lesson",
              position: 1,
              status: "locked",
              mastery: 0,
            },
            {
              id: "5091c7f8-0daa-5e70-b62b-7555b9961ee9",
              title: "Single rotations",
              summary:
                "Fix a left-left imbalance with a right rotation, and a right-right imbalance with a left rotation.",
              kind: "lesson",
              position: 2,
              status: "locked",
              mastery: 0,
            },
            {
              id: "d8eee906-1f24-54d8-94ea-7493cd7538ca",
              title: "Double rotations",
              summary: "Fix a left-right or right-left imbalance with two rotations.",
              kind: "lesson",
              position: 3,
              status: "locked",
              mastery: 0,
            },
            {
              id: "aebd88db-79dd-58b8-a0ad-4df70ae8ea59",
              title: "Inserting into an AVL tree",
              summary:
                "Insert like in a plain search tree, walk back up updating heights, then fix the first unbalanced node.",
              kind: "lesson",
              position: 4,
              status: "locked",
              mastery: 0,
            },
            {
              id: "5038ea53-5616-5a8b-87a6-0ceaa3b783f8",
              title: "Deleting from an AVL tree",
              summary:
                "Remove a key in one of three cases, then walk back up and fix every node that went out of balance.",
              kind: "lesson",
              position: 5,
              status: "locked",
              mastery: 0,
            },
            {
              id: "434824e1-139f-510c-b394-d87952c97ebf",
              title: "AVL final challenge",
              summary: "A final quiz that puts insertion, deletion and rotations together.",
              kind: "checkpoint",
              position: 6,
              status: "locked",
              mastery: 0,
            },
          ],
        },
      ],
      progress: 16,
      currentLessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
    },
  },
  "getLesson:200": {
    data: {
      lesson: {
        id: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
        title: "In-order",
        summary: "Visit the left subtree, then the node, then the right subtree.",
        kind: "lesson",
        position: 3,
        notePrompt:
          "Explain in-order in your own words. Why does in-order give the keys of a search tree from smallest to biggest?",
        objectives: [
          "List the nodes of a tree in in-order",
          "Say how the in-order code differs from the pre-order code",
          "Trace the recursive in-order code and say which calls wait on the call stack",
          "Explain why the in-order of a search tree gives its keys in sorted order",
        ],
      },
      unit: {
        id: "7a333dd1-be52-5dd9-b910-edcebc7ca6b5",
        title: "Binary trees and traversals",
        position: 1,
        treeMode: "bst",
      },
      status: "current",
      previousLessonId: "41f0afbe-6043-5a28-9f20-1d1a239fef77",
      nextLessonId: "59403f22-d038-53bf-8c1c-b2662bbc738c",
      steps: [
        {
          position: 1,
          coreBlock: {
            type: "text",
            body: {
              markdown:
                "## The in-order rule\n\nIn-order also starts at the root, but the steps are in a different order:\n\n1. Do in-order on the left subtree.\n2. Visit the node.\n3. Do in-order on the right subtree.\n\n## The code\n\n```\ninorder(node):\n  if node is empty: return\n  inorder(node.left)\n  visit(node)\n  inorder(node.right)\n```\n\nThis is similar to the pre-order code with `visit(node)` on line 4 instead of line 3.",
            },
            id: "13514ad1-6875-4490-a1bb-db8987b02e71",
            transcript:
              "The in-order rule. In-order also starts at the root, but the steps are in a different order. One, do in-order on the left subtree. Two, visit the node. Three, do in-order on the right subtree. The code. Line 1: inorder of node. Line 2: if node is empty, return. Line 3: inorder of node dot left. Line 4: visit node. Line 5: inorder of node dot right. This is similar to the pre-order code with visit node on line 4 instead of line 3.",
            learningStyleId: null,
          },
          styleBlock: {
            type: "code_trace",
            body: {
              algorithmCode: "inorder",
              startingKeys: [8, 4, 12],
              operation: { operation: "traverse" },
            },
            id: "4438d410-6a79-497a-8329-1ceb7e981821",
            transcript:
              "The code runs on a tree with 8 at the root, 4 on the left and 12 on the right. inorder(8) calls inorder(4) at line 3 and waits on the stack. 4 has no children, so inorder(4) visits 4 and returns. inorder(8) carries on at line 4 and visits 8, then calls inorder(12) at line 5, which visits 12. The visited list is 4, 8, 12.",
            learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
          },
          otherBlocks: [
            {
              type: "text",
              body: {
                markdown:
                  '## Say the new rhythm\n\nPre-order was "me, left, right". In-order moves _me_ to the middle: **left, me, right.**\n\nSay it out loud a few times. The node waits until its whole left side is done.',
              },
              id: "9c07ba53-233e-49b9-be88-7d3a45a251e2",
              transcript:
                'Say the new rhythm. Pre-order was "me, left, right". In-order moves me to the middle: left, me, right. Say it out loud a few times. The node waits until its whole left side is done.',
              learningStyleId: "4ac1818e-597d-426b-8b76-30ec1a315715",
            },
            {
              type: "playground",
              body: {
                startingKeys: [20, 10, 30],
                allowedOperations: ["traverse"],
                instructions:
                  "Use the rule: tap the left side, then the node, then the right side.",
                goal: { kind: "traversal", order: "inorder", keys: [10, 20, 30] },
              },
              id: "83719e77-b5cb-4aa0-af54-8d5e5337d9ba",
              transcript:
                "A tree with 20 at the root. 10 is on its left. 30 is on its right. Use the rule: tap the left side, then the node, then the right side. The answer is 10, 20, 30.",
              learningStyleId: "9e9ff00d-8cbc-4d33-8556-e47592d20399",
            },
            {
              type: "text",
              body: {
                markdown:
                  "## Write the lines that run\n\nWrite down each line of the code that runs on this tree, in order, starting with `inorder(8)`. Leave out the checks for empty nodes.",
                tree: [8, 4, 12, 2, 6],
                write: true,
                answer:
                  "`inorder(8)`, `inorder(4)`, `inorder(2)`, `visit(2)`, `visit(4)`, `inorder(6)`, `visit(6)`, `visit(8)`, `inorder(12)`, `visit(12)`.\n",
              },
              id: "2bad3bfe-9bea-4419-87c1-021dbcd2a6f1",
              transcript:
                "Write the lines that run. The tree has 8 at the root, with 4 on its left and 12 on its right. 4 has children 2 and 6. Write down each line of the code that runs on this tree, in order, starting with inorder of 8. Leave out the checks for empty nodes.",
              learningStyleId: "06b78874-c446-4653-89c8-87da6878f00f",
            },
          ],
        },
        {
          position: 2,
          coreBlock: {
            type: "code_trace",
            body: {
              algorithmCode: "inorder",
              startingKeys: [20, 10, 30],
              operation: { operation: "traverse" },
              markdown:
                "## Trace a small tree\n\nPress **Step** to run the code on the tree one line at a time.\n\nWatch the call stack. `inorder(20)` can't visit 20 until `inorder(10)` is done, so it waits on the stack.",
            },
            id: "52eef9ef-b875-4834-a1ee-a42254410213",
            transcript:
              "Trace a small tree. Press Step to run the code on the tree one line at a time. Watch the call stack. inorder(20) can't visit 20 until inorder(10) is done, so it waits on the stack. The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. inorder(20) calls inorder(10) first, and waits at line 3. 10 has no children, so inorder(10) visits 10 and returns. Then inorder(20) visits 20 at line 4, and calls inorder(30) at line 5, which visits 30. The visited list is 10, 20, 30.",
            learningStyleId: null,
          },
          styleBlock: null,
          otherBlocks: [
            {
              type: "text",
              body: {
                markdown:
                  '## Hear the wait\n\nSay each visit as it happens: "10 ... 20 ... 30."\n\nThere\'s a long wait before you hear 20. inorder(20) sits on the stack the whole time 10 is being done.',
              },
              id: "e68137e6-99db-4e86-ae96-72b677fa5c04",
              transcript:
                'Hear the wait. Say each visit as it happens: "10 ... 20 ... 30." There\'s a long wait before you hear 20. inorder(20) sits on the stack the whole time 10 is being done.',
              learningStyleId: "4ac1818e-597d-426b-8b76-30ec1a315715",
            },
            {
              type: "text",
              body: {
                markdown:
                  "## Make a card pile\n\nWrite `inorder(20)`, `inorder(10)` and `inorder(30)` on three scraps of paper.\n\nAs you press **Step**, put a card on the pile when its call starts, and take the top card off when it finishes.",
              },
              id: "5e1bdfb8-94a6-46c1-8570-c04fe33dd3af",
              transcript:
                "Make a card pile. Write inorder of 20, inorder of 10 and inorder of 30 on three scraps of paper. As you press Step, put a card on the pile when its call starts, and take the top card off when it finishes.",
              learningStyleId: "9e9ff00d-8cbc-4d33-8556-e47592d20399",
            },
            {
              type: "text",
              body: {
                markdown:
                  "## Write the stack\n\nWrite down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes.",
                tree: [40, 20, 60, 10],
                write: true,
                answer:
                  "1. `inorder(40)`\n2. `inorder(20)`, `inorder(40)`\n3. `inorder(10)`, `inorder(20)`, `inorder(40)`\n4. `inorder(20)`, `inorder(40)`\n5. `inorder(40)`\n6. `inorder(60)`, `inorder(40)`\n7. `inorder(40)`\n8. empty\n",
              },
              id: "76efc104-c97c-4d81-b3f2-27ec8c044f57",
              transcript:
                "Write the stack. The tree has 40 at the root, with 20 on its left and 60 on its right. 20 has 10 on its left. Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes.",
              learningStyleId: "06b78874-c446-4653-89c8-87da6878f00f",
            },
          ],
        },
        {
          position: 3,
          coreBlock: {
            type: "code_trace",
            body: {
              algorithmCode: "inorder",
              startingKeys: [8, 4, 12, 2, 6, 10, 14],
              operation: { operation: "traverse" },
              markdown:
                "## Trace the bigger tree\n\n8 is the root, but it isn't visited first. The code finishes the whole left subtree, 2, 4 and 6, before it visits 8.",
            },
            id: "8affb03d-d463-447b-8ac7-74b15a0f3c92",
            transcript:
              "Trace the bigger tree. 8 is the root, but it isn't visited first. The code finishes the whole left subtree, 2, 4 and 6, before it visits 8. The code runs on the tree with 8 at the root. It goes left until it reaches 2, which it visits first. Then it visits 4, 6, 8, 10, 12 and 14. While the left subtree runs, inorder(8) waits on the stack at line 3.",
            learningStyleId: null,
          },
          styleBlock: null,
          otherBlocks: [
            {
              type: "playground",
              body: {
                startingKeys: [50, 30, 70, 20, 40, 60, 80],
                allowedOperations: ["traverse"],
                instructions: "Tap the nodes in in-order.",
                goal: { kind: "traversal", order: "inorder", keys: [20, 30, 40, 50, 60, 70, 80] },
              },
              id: "238bfc1c-873b-4b66-8d85-76fc8608cf8e",
              transcript:
                "A tree with 50 at the root. 30 is on its left, with children 20 and 40. 70 is on its right, with children 60 and 80. Tap the nodes in in-order. The answer is 20, 30, 40, 50, 60, 70, 80.",
              learningStyleId: "9e9ff00d-8cbc-4d33-8556-e47592d20399",
            },
            {
              type: "text",
              body: {
                markdown:
                  "## Predict first\n\nWrite the in-order before you step. Hint: find the leftmost node and start there.\n\nTick each key as the trace visits it.",
                write: true,
              },
              id: "49140ec5-779f-41ff-ba30-f4c474795e10",
              transcript:
                "Predict first. Write the in-order before you step. Hint: find the leftmost node and start there. Tick each key as the trace visits it.",
              learningStyleId: "06b78874-c446-4653-89c8-87da6878f00f",
            },
          ],
        },
        {
          position: 4,
          coreBlock: {
            type: "text",
            body: {
              markdown:
                "## Ascending order\n\nIn a binary search tree, everything on the left is smaller than everything on the right. In-order traversal will produce the ascending order of the keys in the tree.",
            },
            id: "2b1107c8-a579-4169-aced-ddcb82939a60",
            transcript:
              "Ascending order. In a binary search tree, everything on the left is smaller than everything on the right. In-order traversal will produce the ascending order of the keys in the tree.",
            learningStyleId: null,
          },
          styleBlock: {
            type: "code_trace",
            body: {
              algorithmCode: "inorder",
              startingKeys: [40, 20, 60, 10, 30, 50],
              operation: { operation: "traverse" },
            },
            id: "e95ede40-20cd-42ef-bd93-4b5d778e48fe",
            transcript:
              "The code runs on a tree with 40 at the root. 20 is on its left, with children 10 and 30. 60 is on its right, with 50 on its left. Step through and watch the visited list: 10, 20, 30, 40, 50, 60. Each key is bigger than the one before it.",
            learningStyleId: "5ead6b34-39c4-4f05-989f-4ce4b7b2a862",
          },
          otherBlocks: [
            {
              type: "text",
              body: {
                markdown:
                  "## Hear it count up\n\nRead the in-order out loud: 2, 4, 6, 8, 10, 12, 14. You can hear it count up. \n\nIn a binary search tree, in-order always gives the keys smallest to largest.",
              },
              id: "36b30dcc-5f53-42bd-91ee-20060f59de38",
              transcript:
                "Hear it count up. Read the in-order out loud: 2, 4, 6, 8, 10, 12, 14. You can hear it count up. In a binary search tree, in-order always gives the keys smallest to largest.",
              learningStyleId: "4ac1818e-597d-426b-8b76-30ec1a315715",
            },
            {
              type: "playground",
              body: {
                startingKeys: [44, 22, 66, 11, 33, 55, 77],
                allowedOperations: ["traverse"],
                instructions: "Tap the keys from smallest to biggest. That's the in-order.",
                goal: { kind: "traversal", order: "inorder", keys: [11, 22, 33, 44, 55, 66, 77] },
              },
              id: "b42479b7-20cc-4f63-8a92-5d96ceb039da",
              transcript:
                "A tree with 44 at the root. 22 is on its left, with children 11 and 33. 66 is on its right, with children 55 and 77. Tap the keys from smallest to biggest. That's the in-order. The answer is 11, 22, 33, 44, 55, 66, 77.",
              learningStyleId: "9e9ff00d-8cbc-4d33-8556-e47592d20399",
            },
            {
              type: "text",
              body: {
                markdown:
                  "## Why it's sorted\n\nFill in the gaps in your notes:\n\n- Everything in a node's left subtree is ___ than the node.\n- Everything in its right subtree is ___.\n- In-order visits left, then the node, then right, so the keys come out ___.",
                write: true,
                answer: "Smaller, bigger, sorted.\n",
              },
              id: "88d6cd40-9ed5-4a75-bd71-f8785db659e4",
              transcript:
                "Why it's sorted. Fill in the gaps in your notes. Everything in a node's left subtree is blank than the node. Everything in its right subtree is blank. In-order visits left, then the node, then right, so the keys come out blank.",
              learningStyleId: "06b78874-c446-4653-89c8-87da6878f00f",
            },
          ],
        },
        {
          position: 5,
          coreBlock: {
            type: "playground",
            body: {
              startingKeys: [36, 18, 64, 9, 52, 71],
              allowedOperations: ["traverse"],
              instructions: "Tap the nodes in in-order.",
              goal: { kind: "traversal", order: "inorder", keys: [9, 18, 36, 52, 64, 71] },
            },
            id: "b078a6af-052c-46ee-bce3-f8599a8b2925",
            transcript:
              "A tree with 36 at the root. 18 is on its left, with 9 below it. 64 is on its right, with children 52 and 71. Tap the nodes in in-order. The answer is 9, 18, 36, 52, 64, 71.",
            learningStyleId: null,
          },
          styleBlock: null,
          otherBlocks: [],
        },
      ],
    },
  },
  "saveLessonNote:200": {
    data: {
      lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
      body: "In-order gives sorted keys because the left subtree, with the smaller keys, is always visited first.",
      updatedAt: "2026-11-14T10:22:24.049Z",
    },
  },
  "getLessonNote:200": {
    data: {
      lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
      body: "In-order gives sorted keys because the left subtree, with the smaller keys, is always visited first.",
      updatedAt: "2026-11-14T10:22:24.049Z",
    },
  },
  "startAttempt:201": {
    data: {
      attempt: {
        id: "e92d84ea-8647-4b46-9c26-66599ab901bb",
        lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
        kind: "lesson_test",
        topic: null,
        status: "in_progress",
        total: 5,
        answeredCount: 0,
        startedAt: "2026-11-14T10:22:24.080Z",
        finishedAt: null,
      },
      question: {
        id: "75a85d53-20a6-409a-b5c0-40b971108c89",
        position: 1,
        type: "text",
        prompt:
          "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "52,37,#,#,76,#,90,#,#",
        difficulty: 1,
        hints: [],
        hintsTotal: 3,
        hintsRemaining: 3,
      },
      result: null,
    },
  },
  "requestHint:200": {
    data: {
      questionId: "75a85d53-20a6-409a-b5c0-40b971108c89",
      hint: "In-order traversal visits the left subtree first, then the node, then its right subtree.",
      hintNumber: 1,
      hintsRemaining: 2,
    },
  },
  "submitAnswer:200": {
    data: {
      isCorrect: false,
      correctAnswer: { type: "text", text: "37,52,76,90" },
      explanation:
        "In-order visits the left subtree first, then the node, then its right subtree. For this tree that gives 37, 52, 76, 90.",
      replay: { kind: "traversal", order: "inorder" },
      hintsUsed: 1,
      points: 0,
      rating: { before: 1000, after: 927 },
      attempt: {
        id: "e92d84ea-8647-4b46-9c26-66599ab901bb",
        lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
        kind: "lesson_test",
        topic: null,
        status: "in_progress",
        total: 5,
        answeredCount: 1,
        startedAt: "2026-11-14T10:22:24.080Z",
        finishedAt: null,
      },
      question: {
        id: "52bda46a-3779-4820-82fb-a4d8b04d0f7c",
        position: 2,
        type: "text",
        prompt:
          "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "69,53,#,#,72,#,88,#,#",
        difficulty: 1,
        hints: [],
        hintsTotal: 3,
        hintsRemaining: 3,
      },
      result: null,
    },
  },
  "startAttempt:200": {
    data: {
      attempt: {
        id: "e92d84ea-8647-4b46-9c26-66599ab901bb",
        lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
        kind: "lesson_test",
        topic: null,
        status: "in_progress",
        total: 5,
        answeredCount: 1,
        startedAt: "2026-11-14T10:22:24.080Z",
        finishedAt: null,
      },
      question: {
        id: "52bda46a-3779-4820-82fb-a4d8b04d0f7c",
        position: 2,
        type: "text",
        prompt:
          "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "69,53,#,#,72,#,88,#,#",
        difficulty: 1,
        hints: [],
        hintsTotal: 3,
        hintsRemaining: 3,
      },
      result: null,
    },
  },
  "getAttempt:200": {
    data: {
      attempt: {
        id: "e92d84ea-8647-4b46-9c26-66599ab901bb",
        lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
        kind: "lesson_test",
        topic: null,
        status: "finished",
        total: 5,
        answeredCount: 5,
        startedAt: "2026-11-14T10:22:24.080Z",
        finishedAt: "2026-11-14T10:22:24.270Z",
      },
      question: null,
      result: {
        score: 0,
        passed: false,
        points: 0,
        ratingChange: -232,
        masteryBefore: 36,
        masteryAfter: 0,
        reviewLessons: [{ id: "bc0b4ade-53cc-5496-8713-0dcdf95fa107", title: "In-order" }],
        answers: [
          {
            questionId: "75a85d53-20a6-409a-b5c0-40b971108c89",
            position: 1,
            prompt:
              "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
            tree: "52,37,#,#,76,#,90,#,#",
            response: { text: "I am not sure", type: "text" },
            isCorrect: false,
            correctAnswer: { type: "text", text: "37,52,76,90" },
            explanation:
              "In-order visits the left subtree first, then the node, then its right subtree. For this tree that gives 37, 52, 76, 90.",
            replay: { kind: "traversal", order: "inorder" },
            hintsUsed: 1,
            points: 0,
          },
          {
            questionId: "52bda46a-3779-4820-82fb-a4d8b04d0f7c",
            position: 2,
            prompt:
              "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
            tree: "69,53,#,#,72,#,88,#,#",
            response: { text: "I am not sure", type: "text" },
            isCorrect: false,
            correctAnswer: { type: "text", text: "53,69,72,88" },
            explanation:
              "In-order visits the left subtree first, then the node, then its right subtree. For this tree that gives 53, 69, 72, 88.",
            replay: { kind: "traversal", order: "inorder" },
            hintsUsed: 0,
            points: 0,
          },
          {
            questionId: "3ba6b4e2-70bc-4105-a5a7-6ec3da8b0259",
            position: 3,
            prompt: "Write this tree's keys in in-order, with a comma and a space between each.",
            tree: "50,30,#,40,#,#,70,60,#,#,#",
            response: { text: "I am not sure", type: "text" },
            isCorrect: false,
            correctAnswer: { type: "text", text: "30,40,50,60,70" },
            explanation:
              "In a search tree, in-order gives the keys from smallest to biggest: 30, 40, 50, 60, 70.",
            replay: null,
            hintsUsed: 0,
            points: 0,
          },
          {
            questionId: "3bf4f85f-e1ba-43e9-977e-8c32589922ed",
            position: 4,
            prompt: "Tap the nodes of this tree in in-order.",
            tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
            response: { keys: [8, 4, 2, 6, 12, 10, 14], type: "order_nodes" },
            isCorrect: false,
            correctAnswer: { type: "order_nodes", keys: [2, 4, 6, 8, 10, 12, 14] },
            explanation:
              "In-order visits the left subtree, then the node, then the right subtree. That gives 2, 4, 6, then 8, then 10, 12, 14.",
            replay: null,
            hintsUsed: 0,
            points: 0,
          },
          {
            questionId: "b299593a-5bbd-45bb-8a6a-8373036ff4ba",
            position: 5,
            prompt:
              "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
            tree: "39,#,77,69,#,#,#",
            response: { text: "I am not sure", type: "text" },
            isCorrect: false,
            correctAnswer: { type: "text", text: "39,69,77" },
            explanation:
              "In-order visits the left subtree first, then the node, then its right subtree. For this tree that gives 39, 69, 77.",
            replay: { kind: "traversal", order: "inorder" },
            hintsUsed: 0,
            points: 0,
          },
        ],
      },
    },
  },
  "getPracticeTopics:200": {
    data: [
      { topic: "traversals", available: true },
      { topic: "insertion", available: false },
      { topic: "deletion", available: false },
      { topic: "rotations", available: false },
      { topic: "mixed", available: true },
    ],
  },
  "startPractice:201": {
    data: {
      attempt: {
        id: "9ef9a0a3-3ea4-4b60-9ad9-04d8cd3d2f56",
        lessonId: null,
        kind: "practice",
        topic: "traversals",
        status: "in_progress",
        total: 1,
        answeredCount: 0,
        startedAt: "2026-11-14T10:22:24.334Z",
        finishedAt: null,
      },
      question: {
        id: "2817f790-1ad7-4664-afb7-c831f3df7381",
        position: 1,
        type: "text",
        prompt:
          "List the keys of this tree in the order a in-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "37,8,#,18,#,#,69,#,#",
        difficulty: 1,
        hints: [],
        hintsTotal: 3,
        hintsRemaining: 3,
      },
      result: null,
    },
  },
  "nextPracticeQuestion:200": {
    data: {
      attempt: {
        id: "9ef9a0a3-3ea4-4b60-9ad9-04d8cd3d2f56",
        lessonId: null,
        kind: "practice",
        topic: "traversals",
        status: "in_progress",
        total: 2,
        answeredCount: 1,
        startedAt: "2026-11-14T10:22:24.334Z",
        finishedAt: null,
      },
      question: {
        id: "62de9681-1d60-4aaf-acfc-381113b1407d",
        position: 2,
        type: "order_nodes",
        prompt: "Put the keys of this tree in the order a pre-order traversal visits them.",
        tree: "59,10,#,33,#,#,63,#,#",
        difficulty: 1,
        hints: [],
        hintsTotal: 3,
        hintsRemaining: 3,
      },
      result: null,
    },
  },
  "finishPractice:200": {
    data: {
      answered: 2,
      correct: 1,
      ratingChange: -6,
      lessons: [
        {
          lessonId: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
          title: "In-order",
          ratingBefore: 768,
          ratingAfter: 739,
        },
        {
          lessonId: "41f0afbe-6043-5a28-9f20-1d1a239fef77",
          title: "Pre-order",
          ratingBefore: 1000,
          ratingAfter: 1023,
        },
      ],
    },
  },
  "getDailyChallenge:200": {
    data: {
      date: "2026-11-14",
      nextChallengeAt: "2026-11-14T22:00:00.000Z",
      status: "not_started",
      startedAt: null,
      finishedAt: null,
      question: null,
      result: null,
    },
  },
  "startDailyChallenge:201": {
    data: {
      date: "2026-11-14",
      nextChallengeAt: "2026-11-14T22:00:00.000Z",
      status: "in_progress",
      startedAt: "2026-11-14T10:22:24.445Z",
      finishedAt: null,
      question: {
        id: "94688f6d-98d0-4055-bd45-27e35efd1d9e",
        position: 1,
        type: "text",
        prompt:
          "List the keys of this tree in the order a post-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "27,3,#,#,77,47,#,#,93,#,#",
        difficulty: 2,
        hints: [],
        hintsTotal: 0,
        hintsRemaining: 0,
      },
      result: null,
    },
  },
  "startDailyChallenge:200": {
    data: {
      date: "2026-11-14",
      nextChallengeAt: "2026-11-14T22:00:00.000Z",
      status: "in_progress",
      startedAt: "2026-11-14T10:22:24.445Z",
      finishedAt: null,
      question: {
        id: "94688f6d-98d0-4055-bd45-27e35efd1d9e",
        position: 1,
        type: "text",
        prompt:
          "List the keys of this tree in the order a post-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "27,3,#,#,77,47,#,#,93,#,#",
        difficulty: 2,
        hints: [],
        hintsTotal: 0,
        hintsRemaining: 0,
      },
      result: null,
    },
  },
  "submitDailyChallengeAnswer:200": {
    data: {
      date: "2026-11-14",
      nextChallengeAt: "2026-11-14T22:00:00.000Z",
      status: "finished",
      startedAt: "2026-11-14T10:22:24.445Z",
      finishedAt: "2026-11-14T10:22:24.498Z",
      question: null,
      result: {
        prompt:
          "List the keys of this tree in the order a post-order traversal visits them. Type the keys separated by commas, like 1,2,3.",
        tree: "27,3,#,#,77,47,#,#,93,#,#",
        response: { text: "I am not sure", type: "text" },
        isCorrect: false,
        correctAnswer: { type: "text", text: "3,47,93,77,27" },
        explanation:
          "Post-order visits the left subtree first, then its right subtree, then the node. For this tree that gives 3, 47, 93, 77, 27.",
        replay: { kind: "traversal", order: "postorder" },
        points: 0,
        timeTakenSeconds: 0,
      },
    },
  },
  "signOut:200": { success: true },
};
export const capturedErrors: Record<string, unknown> = {
  Unauthorized: {
    message: "Authentication required",
    requestId: "2547a904-73b8-4385-9bb5-9f4cb44f3a51",
  },
  Forbidden: { message: "Lesson is locked", requestId: "c3049792-6538-4b8b-ab0f-0a44f77e8ffc" },
  NotFound: { message: "Lesson not found", requestId: "701acc9f-7a4a-48ac-871c-449f91a9285d" },
  BadRequest: {
    message: "Validation failed",
    issues: [{ path: ["questionId"], message: "Invalid UUID", code: "invalid_format" }],
    requestId: "011cc853-a630-46aa-87db-20c5c685c8e0",
  },
  Conflict: {
    message: "Question is already answered",
    requestId: "d2809d66-89b8-4a63-b830-bcbbcafd81f5",
  },
};
