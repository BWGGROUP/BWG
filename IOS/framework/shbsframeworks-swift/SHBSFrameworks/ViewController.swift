//
//  ViewController.swift
//  AFNetworkingdemo
//
//  Created by SHBS Developer on 16/4/21.
//  Copyright © 2016年 SHBS Developer. All rights reserved.
//

import UIKit
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
     let  par=["username":"111","password":"111","channelid":"111","channelidtype":"1"]
       //  RequestAPI.GET("http://192.168.1.102:8080/YOLOO/login.html", body: par, succeed: succeed, failed: failed)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    @IBAction func click(sender: AnyObject) {
        let  par=["username":"1111","password":"123","channelid":"111","channelidtype":"1"]
        RequestAPI.POST("http://192.168.1.102:8080/YOLOO/login.html", body: par, succeed: succeed, failed: failed)

        
    }
    func succeed(task:NSURLSessionDataTask,responseObject:AnyObject?)->Void{
       // print("qwwqweqe+\(responseObject)")
        let userin:NSDictionary=responseObject!["userInfo"] as! NSDictionary
        let user:userinfo = userinfo.jsonToModel(userin)
        print(user)
    }
    
    func failed(task:NSURLSessionDataTask?,error:NSError)->Void{
        print(error)
    }

}

