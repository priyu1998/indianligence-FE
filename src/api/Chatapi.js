
// // import React from "react";
// // import axios from "axios";
// import {SSE} from 'sse';
// // import { OpenAIApi } from "openai";
// let  apiKey=  "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";

// // const { Configuration, OpenAIApi } = require("openai");
// // const configuration = new Configuration({
// //   apiKey: "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",
// // });
// // const openai = new OpenAIApi(configuration);

// // export const  chatgpt =  function  (parameterObject){
// //     const response =async (parameterObject)=>{

// //        await  openai.createChatCompletion({
// //             model:"gpt-3.5-turbo",
// //             messages:[
// //             {"role": "user", "content": JSON.stringify(parameterObject.inputs)},
// //         ],
// //           })
// //     } 
    
// //         try{
// //             const output = response(parameterObject);
// //             return output.data.choices.messages.content.toString();
                    
// //         }catch(err){
// //             console.log(err);
// //         }

// // }

// let handleSubmit = async ()=>{

//     let url = "https://api.openai.com/v1/completions";
//     let data = {
//         model: "text-davinci-003",
//         prompt: "Write an Article On AI.",
//         temperature: 0.75,
//         top_p: 0.95,
//         max_tokens:100,
//         stream: true,
//         n: 1,
//     };
//     let source = new SSE(url,{

//         headers:{
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${apiKey}`,
//         },
//         method: "POST",
//         payload: JSON.stringify(data),
//     });

//     source.addEventListener("message",(e)=>{
//         if(e.data !== "[DONE]"){
//             let payload = JSON.parse(e.data);
//             let text = payload.choices[0].text;
//             if(text !== "\n"){
//                 resultRef.current = resultRef.current + text;
//                 setOutput(resultRef.current);
//             }
//         }else{
//             source.close();
//         }

//     });
//     source.stream();
// };



