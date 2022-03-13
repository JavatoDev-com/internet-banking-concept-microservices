package com.javatodev.finance.configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javatodev.finance.exception.SimpleBankingGlobalException;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Slf4j
public class CustomFeignErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {

        SimpleBankingGlobalException simpleBankingGlobalException = extractBankingCoreGlobalException(response);

        switch (response.status()) {
            case 400:
                log.error("Error in request went through feign client {} ", simpleBankingGlobalException.getMessage() + " - " + simpleBankingGlobalException.getCode());
                return simpleBankingGlobalException;
            case 401:
                log.error("Unauthorized Request Through Feign");
                return new Exception("Unauthorized Request Through Feign");
            case 404:
                log.error("Unidentified Request Through Feign ");
                return new Exception("Unidentified Request Through Feign");
            default:
                log.error("Error in request went through feign client");
                return new Exception("Common Feign Exception");
        }

    }

    private SimpleBankingGlobalException extractBankingCoreGlobalException(Response response) {
        SimpleBankingGlobalException exceptionMessage = null;
        Reader reader = null;
        //capturing error message from response body.
        try {
            reader = response.body().asReader(StandardCharsets.UTF_8);
            String result = IOUtils.toString(reader);
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            exceptionMessage = mapper.readValue(result,
                    SimpleBankingGlobalException.class);
        } catch (IOException e) {
            log.error("IO Exception on reading exception message feign client" + e);
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException e) {
                log.error("IO Exception on reading exception message feign client" + e);
            }
        }
        return exceptionMessage;
    }
}
