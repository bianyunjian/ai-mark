package cn.airesearch.aimarkserver.bean;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.cors.CorsUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 过滤请求
 *
 * @author yunjian.bian
 */
@Configuration
@WebFilter(value = "/*")
@Slf4j
public class GlobalFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String url = req.getRequestURI();
        log.debug(url);

        //HeaderMapRequestWrapper requestWrapper = new HeaderMapRequestWrapper(req);
        //requestWrapper.addHeader(HEADER_ServerDomain, "cn.asr");

        HttpServletResponse resp = (HttpServletResponse) response;
//        resp.addHeader(ApplicationConst.HEADER_ServerDomain_Key, ApplicationConst.HEADER_ServerDomain_Value);

        //跨域问题
        CheckCors(req, resp);

        chain.doFilter(request, response);
    }

    private void CheckCors(HttpServletRequest request, HttpServletResponse response) {
        if (CorsUtils.isCorsRequest(request) == false) {
            return;
        }

        response.addHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, request.getHeader(HttpHeaders.ORIGIN));
        response.addHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS));
        String requestMethod = request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD);
        if (requestMethod != null) {
            response.addHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, requestMethod);
        }
        response.addHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        response.addHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "all");
        response.addHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");

        if (request.getMethod() == HttpMethod.OPTIONS.name()) {
            response.setStatus(HttpStatus.OK.value());
        }
    }

    @Override
    public void destroy() {

    }


}
