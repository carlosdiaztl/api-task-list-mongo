// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
  origin: [
    "http://localhost:5000",
    "http://localhost:4200",
    "http://127.0.0.1:5500",
    "https://task-manager-cm01icto0-carlosdiaztls-projects.vercel.app",
    "https://task-manager-ni6yiga12-carlosdiaztls-projects.vercel.app",
    "https://task-manager-o0hpjzhbc-carlosdiaztls-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

export { corsOptions };
