import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage(props) {

  //LandingPage 들어오자마자 실행하는 것
  useEffect(() => {
    axios.get('/api/hello') //서버에 보내는 것
    .then(response => console.log(response)) //서버에서 오는 response를 콘솔창에 띄움
  }, [])

  const onClickHandler = () => {
    axios.get('/api/users/logout')
        .then(response => {
            console.log(response);
            if (response.data.success) {
                props.history.push('/login');
            } else {
                alert("로그아웃에 실패했습니다.")
            }
        })
  }
  

  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      width:'100%', height:'100vh'
    }}>
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>
        로그아웃
      </button>
    </div>
  )
}

export default LandingPage