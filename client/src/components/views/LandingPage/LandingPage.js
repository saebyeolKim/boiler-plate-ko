import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage() {

  //LandingPage 들어오자마자 실행하는 것
  useEffect(() => {
    axios.get('/api/hello') //서버에 보내는 것
    .then(response => console.log(response)) //서버에서 오는 response를 콘솔창에 띄움
  }, [])
  

  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      width:'100%', height:'100vh'
    }}>
      <h2>시작페이지</h2>
    </div>
  )
}

export default LandingPage