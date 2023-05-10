import axios, { Axios } from "axios";
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
            })
        
            Axios.length('/api/users/auth')
          return () => {
          }
        }, [])
        

    }



    return AuthenticatonCheck
}
