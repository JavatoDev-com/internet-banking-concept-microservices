package com.javatodev.finance.configuration.supabase;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class SupabaseProperties {

    @Value("${app.config.supabase.url}")
    private String url;

    @Value("${app.config.supabase.service-role-key}")
    private String serviceRoleKey;
}
