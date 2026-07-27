package com.javatodev.finance.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.javatodev.finance.configuration.supabase.SupabaseProperties;
import com.javatodev.finance.exception.EntityNotFoundException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SupabaseAuthService {

    private final SupabaseProperties props;
    private final RestClient restClient;

    public SupabaseAuthService(SupabaseProperties props, RestClient.Builder builder) {
        this.props = props;
        this.restClient = builder.build();
    }

    public boolean emailExists(String email) {
        ListUsersResponse response = restClient.get()
                .uri(adminUsersUrl() + "?filter=" + email)
                .header("Authorization", "Bearer " + props.getServiceRoleKey())
                .header("apikey", props.getServiceRoleKey())
                .retrieve()
                .body(ListUsersResponse.class);

        if (response == null || response.users() == null) {
            return false;
        }
        return response.users().stream().anyMatch(u -> email.equalsIgnoreCase(u.email()));
    }

    public String createUser(String email, String password, String firstName, String lastName) {
        Map<String, String> metadata = Map.of("first_name", firstName, "last_name", lastName);
        CreateUserRequest request = new CreateUserRequest(email, password, false, metadata);

        SupabaseUser created = restClient.post()
                .uri(adminUsersUrl())
                .header("Authorization", "Bearer " + props.getServiceRoleKey())
                .header("apikey", props.getServiceRoleKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(SupabaseUser.class);

        if (created == null || created.id() == null) {
            throw new RuntimeException("Failed to create user in Supabase Auth");
        }
        log.info("Created Supabase Auth user with id={}", created.id());
        return created.id();
    }

    public String readUserEmail(String authId) {
        try {
            SupabaseUser user = restClient.get()
                    .uri(adminUsersUrl() + "/" + authId)
                    .header("Authorization", "Bearer " + props.getServiceRoleKey())
                    .header("apikey", props.getServiceRoleKey())
                    .retrieve()
                    .body(SupabaseUser.class);

            if (user == null) {
                throw new EntityNotFoundException("User not found under given ID");
            }
            return user.email();
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to read Supabase Auth user authId={}: {}", authId, e.getMessage());
            throw new EntityNotFoundException("User not found under given ID");
        }
    }

    public void confirmUser(String authId) {
        restClient.put()
                .uri(adminUsersUrl() + "/" + authId)
                .header("Authorization", "Bearer " + props.getServiceRoleKey())
                .header("apikey", props.getServiceRoleKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("email_confirm", true))
                .retrieve()
                .toBodilessEntity();
        log.info("Confirmed Supabase Auth user authId={}", authId);
    }

    private String adminUsersUrl() {
        return props.getUrl() + "/auth/v1/admin/users";
    }

    private record CreateUserRequest(
            String email,
            String password,
            @JsonProperty("email_confirm") boolean emailConfirm,
            @JsonProperty("user_metadata") Map<String, String> userMetadata
    ) {}

    private record SupabaseUser(
            String id,
            String email
    ) {}

    private record ListUsersResponse(
            List<SupabaseUser> users
    ) {}
}
