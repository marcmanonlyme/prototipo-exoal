package com.exoal.prototipo.controller;

import com.exoal.prototipo.entity.Sede;
import com.exoal.prototipo.entity.Usuario;
import com.exoal.prototipo.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioController usuarioController;

    private Sede sede;
    private Usuario usuario1;
    private Usuario usuario2;

    @BeforeEach
    void setUp() {
        sede = new Sede("Plantel Centro", "plantel", "Av. Universidad 123", "555-0101", "centro@univ.edu");
        sede.setIdSede(1L);

        usuario1 = new Usuario("Admin Principal", "admin@univ.edu", "hash123", "administrador", sede);
        usuario1.setIdUsuario(1L);

        usuario2 = new Usuario("Docente María", "maria@univ.edu", "hash456", "docente", sede);
        usuario2.setIdUsuario(2L);
    }

    @Test
    void getAllUsuarios_retornaListaCompleta() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1, usuario2));

        List<Usuario> result = usuarioController.getAllUsuarios();

        assertEquals(2, result.size());
        assertEquals("Admin Principal", result.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void getUsuarioById_existente_retornaUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        ResponseEntity<Usuario> response = usuarioController.getUsuarioById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("admin@univ.edu", response.getBody().getEmail());
    }

    @Test
    void getUsuarioById_noExistente_retorna404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<Usuario> response = usuarioController.getUsuarioById(99L);

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void createUsuario_guardaYRetornaUsuario() {
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        Usuario result = usuarioController.createUsuario(usuario1);

        assertNotNull(result);
        assertEquals("administrador", result.getTipoUsuario());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(usuarioRepository, times(1)).save(usuario1);
    }

    @Test
    void createUsuario_sinPassword_lanza400() {
        Usuario sinPassword = new Usuario("Test", "test@demo.edu", null, "estudiante", sede);
        assertThrows(ResponseStatusException.class, () -> usuarioController.createUsuario(sinPassword));
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void updateUsuario_conPasswordNuevo_actualizaPasswordHasheada() {
        Usuario detalles = new Usuario("Admin Actualizado", "admin@univ.edu", "nuevaPassword", "administrador", sede);
        when(passwordEncoder.encode("nuevaPassword")).thenReturn("$2a$10$hashedNueva");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        ResponseEntity<Usuario> response = usuarioController.updateUsuario(1L, detalles);

        assertEquals(200, response.getStatusCode().value());
        verify(passwordEncoder, times(1)).encode("nuevaPassword");
        verify(usuarioRepository, times(1)).save(usuario1);
        assertEquals("$2a$10$hashedNueva", usuario1.getPassword());
    }

    @Test
    void updateUsuario_conPasswordVacia_noActualizaPassword() {
        usuario1.setPassword("passwordOriginal");
        Usuario detalles = new Usuario("Admin Actualizado", "admin@univ.edu", "", "administrador", sede);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1);

        usuarioController.updateUsuario(1L, detalles);

        verify(passwordEncoder, never()).encode(anyString());
        assertEquals("passwordOriginal", usuario1.getPassword());
    }

    @Test
    void updateUsuario_noExistente_retorna404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<Usuario> response = usuarioController.updateUsuario(99L, usuario1);

        assertEquals(404, response.getStatusCode().value());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void deleteUsuario_llamaDeleteById() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        doNothing().when(usuarioRepository).deleteById(1L);

        ResponseEntity<Void> response = usuarioController.deleteUsuario(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(usuarioRepository, times(1)).deleteById(1L);
    }
}
