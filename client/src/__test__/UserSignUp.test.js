import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignUp } from "../pages/signUp";

describe("Validações do Input Nome", () => {
  it("Deve aceitar nome válido", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/o nome é obrigatório/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/digite apenas letras/i)).not.toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando nome está vazio", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/o nome é obrigatório/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando nome tem menos de 3 caracteres", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "Ab" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando nome tem mais de 60 caracteres", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    const longName = "A".repeat(61);
    fireEvent.change(nameInput, { target: { value: longName } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/máximo 60 caracteres/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando nome contém números", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "João123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando nome contém caracteres especiais", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "João@Silva" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando há múltiplos espaços em branco", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "João    Silva" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/não são permitidos múltiplos espaços em branco/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando há mais de 2 letras repetidas consecutivas", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "Jooão Silva" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/não são permitidas mais de 2 letras repetidas consecutivas/i)).toBeInTheDocument();
    });
  });

  it("Deve aceitar nome com acentos e ç", async () => {
    render(<SignUp />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: "François Müller Àgàthà" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/digite apenas letras/i)).not.toBeInTheDocument();
    });
  });
});

describe("Validações do Input Email", () => {
  it("Deve aceitar email válido", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "usuario@exemplo.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/e-mail inválido/i)).not.toBeInTheDocument();
    });
  });

  it("Deve mostrar erro quando email está vazio", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/o e-mail é obrigatório/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro para email sem @", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "usuarioexemplo.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro para email sem domínio", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "usuario@" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar erro para email com domínio inválido", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "usuario@exemplo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  it("Deve aceitar emails com subdomínios", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "usuario@sub.exemplo.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/e-mail inválido/i)).not.toBeInTheDocument();
    });
  });

  it("Deve aceitar emails com caracteres especiais no nome", async () => {
    render(<SignUp />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    fireEvent.change(emailInput, { target: { value: "user.name+tag@exemplo.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/e-mail inválido/i)).not.toBeInTheDocument();
    });
  });
});