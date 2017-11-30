[![Coverage Status](https://coveralls.io/repos/github/RaianRaika/param-validation/badge.svg?branch=master)](https://coveralls.io/github/RaianRaika/param-validation?branch=master)
[![Build Status](https://travis-ci.org/RaianRaika/param-validation.svg?branch=master)](https://travis-ci.org/RaianRaika/param-validation)
# IT's a draft and not finalized yet!.

# param-validation

A general param schema validation middle-ware.

Supported Framework:
* Sails.JS    



**Note**: \
***This project is under heavy developments.***
### Installing

Install node module

```
npm i param-validation
```

**Initialize Param-Validation.**

*Note: In Sails.js,its better put your paramValidator initialize in bootstrap script and set it as global.*

```
  let paramValidator = new ParamValidator(yourAPP, ParamValidatonConfig)
```

And add validator in your middleware framework.

```
 paramValidator: function (req, res, next) {
    paramValidator.validator(req, res, next);
},
```
#### Config :

Create a config file under Config folder with any name and put this content on it.

```
 {
    projectBaseDIR: require('path').resolve(__dirname, '../'),
    routeConfig: 'api/ParamValidator/ValidatorBank',
    scriptValidatorPath: 'api/ParamValidator/ValidatorBank/script',
    excludePrefix: '^(\/upload\/center).*$',
}
```

* ###### validatorBaseRepo :
	This config is required, and point to the path of your JSON definition of param validation

* ###### scriptBaseRepo :
	This config is required, and point to the path  of your script definition of param validation

* ##### excludePrefix :
	A regex that exclude any path from param validator


##### Param Validator

 ###### The JSON Object properties

 * **URL** \
            The URL that should validate ( should be like route config )
 * **METHOD** \
 			The METHOD should be GET, PUT, DELETE or POST
 * **QueryParam**, **InPath**, **HEADER**, **BODY** or **SCRIPT** \
 			The way of validations :D
 			PS1: The `QueryParam`, `InPath`, `HEADER` and `BODY` are case sensitive.
 			PS2: The `QueryParam`, `InPath`, `HEADER` and `BODY` are point to an scope of param in any request.
 			PS3: Script keyword used for all param scope and should handel with developer.
 			PS4: any route that point to `SCRIPT`, will will skip the other param scope.

 ###### Validation config
 * **Any param scope** : In this method, you can define a JSON file to validate your param automatically
 	* Independent properties
 		* `type` : number, date, string, array, object, email, phone, boolean`
 			*  Multi data type could assign to a param with separator `|`
 		* `required`: define the param is required or not,default value is true
    * Depend properties
    	* type `number`
    		* min :  minimum acceptable value
    		* max :  maximum acceptable value
        * type `string`
        	* minLength : minimum acceptable length of string
        	* maxLength : maximum acceptable length of string
        	* length : acceptable length of string
      	* type `array`
      		* rows: in the rows we can define the param and flow the validation config as well.
        * type `object`
        	* body: the properties of the JSON Object and can use all the validation config as well.

 	* Addition operation
 		* `compareWithFiled` :  compare one pram with another ones
        	* this param defined as an array, each rows of this array should defined with a single string like ` operator:param_name `
        	* acceptable operators: all the valid logical compare operand in JS!
        * `regex64` : validate a param with regex,this param should define in config file as an regex that encoded with base64

 * `SCRIPT`: In this method you can write your own script to validate your param in your way
 	* this param should contain the path of your validator script file
 	* the file should be under your `scriptBaseRepo` path
 	* in valid param checking the script should return `true` value
 	* on any invalidation just throw an Error
 	* any Error message that you throw will be send and formatted in response
 	* the script file should be like :

```
	 module.exports.validator = function (params) {
 		 "use strict";

  		return true;
	}
```
#### Some Validator Config
* **Simple JSON Config**
```
	{
  "URL": "/test/:param1/callcenter/:param2",
  "METHOD": "GET",
  "BODY": {
    "param1": {
      "type": "number"
    },
    "param2": {
      "type": "number",
      "min": 1,
      "max": 4,
      "required": false
    },
  }
}
```
* **Array Base JSON Config**
```
[
  {
    "URL": "/test1",
    "METHOD": "get",
    "BODY": {
     "date_from": {
      "type": "date",
      "required": false,
      "regex64": "aBase64String",
      "compareWithFiled": [
        "<:date_to"
      ]
    },
    "date_to": {
      "type": "date",
      "required": false,
      "regex64": "aBase64String",
      "compareWithFiled": [
        ">:date_from"
      ]
    }
    }
  },
  {
    "URL": "/test2",
    "METHOD": "get",
    "SCRIPT": "./script/testScript2.js"
  }
]
```
* ***single JSON Config***
```
{
	"URL": "/test3",
    "METHOD:"post",
    "BODY":{
     "details": {
      "type": "array",
      "required": false,
      "rows": {
        "type": "object",
        "body": {
          "detail_id": {
            "type": "number"
          },
          "language": {
            "type": "string",
            "required": false,
            "regex64": "aBase64String",
            "length": 5
          },
          "title": {
            "type": "string",
            "required": false,
            "maxLength": 1024
          },
          "channel": {
            "type": "string",
            "required": false
          }
        }
      }
    }
    }
}
```
* ***A complext Config Desing***
```
{
  "group a": [
    {
      "URL": "/test5/:id",
      "METHOD": "DELETE",
      "SCRIPT": "./script/something.js"
    },
    {
      "URL": "/test6",
      "METHOD": "POST",
      "SCRIPT": "./script/something2.js"
    }
  ],
  "group b": [
    {
      "URL": "/test7",
      "METHOD": "PUT",
      "SCRIPT": "./script/something3.js"
    }
  ]
}

```




## Authors

* **Amin Aghabeiki**


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
