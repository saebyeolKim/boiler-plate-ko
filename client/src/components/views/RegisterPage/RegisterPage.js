import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
  const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ComfirmPassword, setComfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onComfirmPasswordHandler = (event) => {
        setComfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //페이지 리프레쉬 되는것을 막기 위한 것
        
        if(Password !== ComfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }
        
        let body= {
            email : Email,
            name : Name,
            password : Password
        }

        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })

        
    }
    
    return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      width:'100%', height:'100vh'
      }}>
          <form style={{display:'flex', flexDirection:'column'}}
              onSubmit={onSubmitHandler}
          >
              <label>Email</label>
              <input type="email" value={Email} onChange={onEmailHandler} />
              
              <label>Name</label>
              <input type="text" value={Name} onChange={onNameHandler} />
              
              <label>Password</label>
              <input type="password" value={Password} onChange={onPasswordHandler} />
              
              <label>Comfirm Password</label>
              <input type="password" value={ComfirmPassword} onChange={onComfirmPasswordHandler} />
              
              <br/>
              <button>
                회원가입
              </button>
          </form>
      </div>
  )
}

export default withRouter(RegisterPage)