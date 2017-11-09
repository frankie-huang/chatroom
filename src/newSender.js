//getData(data[,debug])
import axios from 'axios';

function Sender(){
    let defaultUrl = "./php/index.php";
    let uploadUrl = "http://localhost/php/uploadFiles.php";

    function generateFormData(data){
        let formData = new FormData();
        for (let key in data){
            formData.append(key,data[key]);
        }
        return formData;
    }

    function getData(data,callBack,debug){

        var request = {
            url:defaultUrl,
            method:'post',
            data:generateFormData(data)
        }
        axios(request).then(function(response){
            //success
            if (debug){
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                document.write(response.data);
                return ;
            }
            callBack(response.data);

        }).catch(function(error){
            if(error.response){
                //存在请求，但是服务器的返回一个状态码
                //他们都在2xx之外
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }else{
                //一些错误是在设置请求时触发的
                console.log('Error',error.message);
            }
            console.log(error.config);
        });
    }

    function uploadFile(data,callBack,processCallBack,debug){
        let request = {
            url:uploadUrl,
            method:"post",
            data:data,
            onUploadProgress: (progressEvent)=> {
                if (progressEvent.lengthComputable){
                    let percentage = (progressEvent.loaded*100)/progressEvent.total;
                    processCallBack(percentage);
                }
              }
        }
        axios(request).then(function(response){
            //success
            if (debug){
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                try {
                    document.write(JSON.parse(response.data));
                } catch (err){
                    document.write(response.data);
                }
                return ;
            }
            callBack(response.data);

        }).catch(function(error){
            if(error.response){
                //存在请求，但是服务器的返回一个状态码
                //他们都在2xx之外
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }else{
                //一些错误是在设置请求时触发的
                console.log('Error',error.message);
            }
            console.log(error.config);
        });
    }

    return {
        getData:getData.bind(this),
        uploadFile:uploadFile.bind(this)
    }
}

export default Sender;