import userModel from "../modals/userModal.js";

export const test = (req, res) => {
  res.json({ data: "hello" });
};

export const verifyUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      throw new Error("invalid credentials");
    }
    const posibleUsername = await userModel.posibleUsername(username);
    res.status(200).json({ posibleUsername });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: true });
  }
};
