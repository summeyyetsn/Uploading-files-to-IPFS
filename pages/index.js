import axios from "axios";
import useWallet from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import useVerificationFunctions from "@/hooks/useVerificationFunctions";

export default function Home() {

  const [imageURL, setImageURL] = useState("");

  const {wallet} = useWallet();

  const {documents, addFile, viewDocuments, verifyFile } = useVerificationFunctions();

  useEffect(() =>{
    wallet.connect();
    if (wallet.address){
      viewDocuments();
    }
  }, [wallet.address])

  const handleSubmit = (e) => {
    e.preventDefault();
    addFile(imageURL)
    console.log("Submite basıldı")
  }

  const handleChange = async (e) => {
    e.preventDefault();

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0])
      reader.onload = async () => {
        const base64 = reader.result;
        const uploadArray = [{
          path: `document.png`,
          content: base64
        }];
        console.log(uploadArray);

        try {

          const response = await axios({
            method: "post",
            url: "/api/upload/image",
            data: uploadArray,
            headers: {
              "Content-Type": "application/json"
            }
          })
          console.log(response.data[0].path);
          setImageURL(response.data[0].path);
        }
        catch (error) {
          console.log(error)
        }
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit" >Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>URI</th>
            <th>isVerified</th>
          </tr>
        </thead>

        <tbody>
          {documents?.map((document, i) =>(
            <tr key={document.ID}>
              <td>{document.ID}</td>
              <td>{document.sender}</td>
              <td><a href={`${document.uri}`} target="_blank">view</a></td>       {/* <td>{document.uri}</td> */}
              <td>{document.isVerified}</td>
              <td><button onClick={() => verifyFile(document.ID)}>VERIFY</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
