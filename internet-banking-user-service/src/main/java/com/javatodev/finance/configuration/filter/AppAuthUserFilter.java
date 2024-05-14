package com.javatodev.finance.configuration.filter;

import org.apache.commons.lang.StringUtils;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AppAuthUserFilter implements Filter {

    private static final String HTTP_HEADER_AUTH_USER_ID = "X-Auth-Id";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String userAuthId = httpServletRequest.getHeader(HTTP_HEADER_AUTH_USER_ID);
        log.info("Incoming Request From {}", userAuthId);
        if (!StringUtils.isEmpty(userAuthId)) {
            ApiRequestContextHolder.getContext().setAuthId(userAuthId);
        }
        try {
            chain.doFilter(request, response);
        }finally {
            ApiRequestContextHolder.clearContext();
        }
    }
}
