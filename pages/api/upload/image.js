const Moralis = require("moralis").default;


if (!Moralis.Core.isStarted) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.log("api key yok")
        process.exit(1);
    }
    Moralis.start({ apiKey: apiKey })
}


export default async (req, res) => {
    const body = req.body;
    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi: body });
    return res.status(200).json(response)
}
