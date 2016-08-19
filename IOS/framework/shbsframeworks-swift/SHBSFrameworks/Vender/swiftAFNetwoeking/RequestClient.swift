//
//  RequestClient.swift
//  AFNetworkingdemo
//
//  Created by SHBS 张子光 on 16/4/21.
//  Copyright © 2016年 SHBS Developer. All rights reserved.
//  单例AFNetworking 
//

import UIKit
import AFNetworking
class RequestClient: AFHTTPSessionManager {
    
    class var sharedInstance:RequestClient {
        struct Static{
            static var onceToken:dispatch_once_t = 0
            static var instance:RequestClient? = nil
        }
        dispatch_once(&Static.onceToken, { () -> Void in
            //string填写相应的baseUrl即可
            let url:NSURL = NSURL(string: "")!
            Static.instance = RequestClient(baseURL: url)
            })
        //返回本类的一个实例
        return Static.instance!
    }
}
