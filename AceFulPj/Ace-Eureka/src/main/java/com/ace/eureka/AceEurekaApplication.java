package com.ace.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class AceEurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(AceEurekaApplication.class, args);
    }
}

