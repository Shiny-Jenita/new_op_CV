const environments = {
    Dev: "https://dev-api.optimizedcv.ai/api/v1/",
    Qa: "http://localhost:5000/api/v1/",
    Production: "",
  };
  const currentEnv = process.env.NEXT_PUBLIC_ENV || "Dev";
  const config = {
    baseUrl: environments[currentEnv] || environments.Dev,
  };
  
  export default config;
  