export default function handler(req, res) {
  res.json({
    envExists: !!process.env.GEMINI_API_KEY
  });
}
