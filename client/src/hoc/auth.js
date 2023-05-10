import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) { //SpecificComponent: 페이지 컴포넌트, 

    //option
    //null      => 아무나 출입이 가능한 페이지
    //true      => 로그인한 유저만 출입이 가능한 페이지
    //false     => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticatonCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {
            
            dispatch(auth()).then(response => {
                console.log(response);

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history('/login');
                    }
                } else {
                    //로그인한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        //관리자가 아닌 사람이 관리잠 페이지를 들어가려고 할 때
                        props.history.push('/');
                    } else {
                        if(option === false) {
                            //로그인한 유저가 들어가지 못하는 페이지를 들어가려고 할 때
                            props.history.push('/');
                        }
                        
                    }
                }
            })
        
        }, [])
        
        return (
            <SpecificComponent />
        )

    }



    return AuthenticatonCheck
}
