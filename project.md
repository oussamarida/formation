exmaple project
├── controller (4)
│   ├── agentController.ts
│   ├── authController.ts
│   └── departementController.ts
├── data (optional)
│   ├── agents.json
│   ├── departements.json
│   └── users.json
├── database (6)
│   ├── data-source.ts
│   ├── entities
│   │   ├── Agent.ts
│   │   ├── Conge.ts
│   │   ├── Departement.ts
│   │   └── User.ts
│   ├── init.ts
│   └── seed-users.ts
├── middleware (3)
│   ├── authMiddleware.ts
│   └── roleMiddleware.ts
├── route (2)
│   ├── agentRoutes.ts
│   ├── authRoutes.ts
│   └── departementRoutes.ts
├── service (5)
│   ├── agentService.ts
│   ├── authService.ts
│   ├── departementService.ts
│   └── userService.ts
├── types
│   ├── agent.ts
│   ├── departement.ts
│   └── user.ts
├── utils
│    ├── parseId.ts
│    └── password.ts
├── index.ts (1)
├── package-lock.json
├── package.json
├── tsconfig.json