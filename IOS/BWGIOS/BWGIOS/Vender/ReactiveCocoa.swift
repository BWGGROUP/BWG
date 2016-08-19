//
//  ReactiveCocoa.swift
//
//
//  Created by SHBS 张子光 on 16/4/21.
//  Copyright © 2016年 SHBS Developer. All rights reserved.
//  swift 使用 ReactiveCocoa 信号<=信号 信号关联
//
import ReactiveCocoa
public struct RAC  {
    var target : NSObject!
    var keyPath : String!
    var nilValue : AnyObject!

    init(_ target: NSObject!, _ keyPath: String, nilValue: AnyObject? = nil) {
        self.target = target
        self.keyPath = keyPath
        self.nilValue = nilValue
    }

    func assignSignal(signal : RACSignal) {
        signal.setKeyPath(self.keyPath, onObject: self.target, nilValue: self.nilValue)
    }
}

public func RACObserve(target: NSObject!, keyPath: NSString) -> RACSignal  {
    return target.rac_valuesForKeyPath(keyPath as String, observer: target)
}

public func <= (rac:RAC, signal:RACSignal){
    rac.assignSignal(signal)
}

public func >=( signal:RACSignal, rac:RAC){
    rac.assignSignal(signal)
}
