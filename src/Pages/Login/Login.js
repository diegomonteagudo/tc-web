import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';



export default function Login(){
  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return(
    <>
      <Link to="/">
        <button>Go back</button>
      </Link>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </>
  )
}
