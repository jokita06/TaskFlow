import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SignUp } from '../pages/SignUp.jsx';
import '@testing-library/jest-dom';
import { RegisterTask } from '../pages/RegisterTask.jsx';

describe("Validações no formulário de cadastro de tarefa", () => {
    
    it('Deve renderizar o título e os campos do formulário', () => {
        render(<RegisterTask />);

        const heading = screen.getByRole('heading', { name: /cadastro de tarefas/i });
        expect(heading).toBeInTheDocument();

        const nameInput = screen.getByLabelText(/nome/i);
        expect(nameInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText(/descrição/i);
        expect(descriptionInput).toBeInTheDocument();

        const sectorInput = screen.getByLabelText(/setor/i);
        expect(sectorInput).toBeInTheDocument();

        const creatorSelect = screen.getByLabelText(/criador/i);
        expect(creatorSelect).toBeInTheDocument();

        const prioritySelect = screen.getByLabelText(/prioridade/i);
        expect(prioritySelect).toBeInTheDocument();

        const statusSelect = screen.getByLabelText(/status/i);
        expect(statusSelect).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: /cadastrar/i });
        expect(submitButton).toBeInTheDocument();

        const statusMessage = screen.getByRole('status');
        expect(statusMessage).toBeInTheDocument();
    })
    
    it("Deve mostrar erro quando nome está vazio", async () => {
        render(<RegisterTask />);

        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(nameInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/o nome é obrigatório/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando nome tem menos de 5 caracteres", async () => {
        render(<RegisterTask />);

        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(nameInput, { target: { value: "Abcd" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/mínimo 5 caracteres/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando nome tem mais de 60 caracteres", async () => {
        render(<RegisterTask />);
        
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
        render(<RegisterTask />);

        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(nameInput, { target: { value: "Tarefa1" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando nome contém caracteres especiais", async () => {
        render(<RegisterTask />);
        
        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });
        
        fireEvent.change(nameInput, { target: { value: "Tarefa@!" } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {  
            expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando nome contém mais de 2 letras repetidas consecutivas", async () => {
        render(<RegisterTask />);

        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(nameInput, { target: { value: "Joooão Silva" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidas mais de 2 letras repetidas consecutivas/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando nome contém múltiplos espaços em branco", async () => {
        render(<RegisterTask />);

        const nameInput = screen.getByLabelText(/nome/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(nameInput, { target: { value: "Tarefa    Teste" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidos múltiplos espaços em branco/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando descrição está vazia", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(descriptionInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/a descrição é obrigatória/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando descrição tem menos de 10 caracteres", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(descriptionInput, { target: { value: "Descrição" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/a descrição deve ter no mínimo 10 caracteres/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando descrição tem mais de 255 caracteres", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        const longDescription = "A".repeat(256);
        fireEvent.change(descriptionInput, { target: { value: longDescription } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/a descrição deve ter no máximo 255 caracteres/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando descrição contém mais de 2 letras repetidas consecutivas", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(descriptionInput, { target: { value: "Boooa descrição de tarefa" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidas mais de 2 letras repetidas consecutivas/i)).toBeInTheDocument();
        });
    });

    it ("Deve mostrar erro quando descrição contém múltiplos espaços em branco", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(descriptionInput, { target: { value: "Descrição    com múltiplos espaços" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidos múltiplos espaços em branco/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando iniciar descrição com número", async () => {
        render(<RegisterTask />);

        const descriptionInput = screen.getByLabelText(/descrição/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(descriptionInput, { target: { value: "1Descrição inválida" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/o nome deve começar com letra e pode conter números/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor está vazio", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/o setor é obrigatório/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor tem menos de 2 caracteres", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "A" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/mínimo 2 caracteres/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor tem mais de 30 caracteres", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        const longSector = "A".repeat(31);
        fireEvent.change(sectorInput, { target: { value: longSector } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/máximo 30 caracteres/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor contém números", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "Setor1" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor contém caracteres especiais", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "Setor@!" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/digite apenas letras/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando setor contém mais de 2 letras repetidas consecutivas", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "Maaaarketing" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidas mais de 2 letras repetidas consecutivas/i)).toBeInTheDocument();
        });
    });

    it ("Deve mostrar erro quando setor contém múltiplos espaços em branco", async () => {
        render(<RegisterTask />);

        const sectorInput = screen.getByLabelText(/setor/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(sectorInput, { target: { value: "Recursos    Humanos" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/não são permitidos múltiplos espaços em branco/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando criador é inválido", async () => {
        render(<RegisterTask />);

        const creatorSelect = screen.getByLabelText(/criador/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(creatorSelect, { target: { value: 0 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/o criador é obrigatório/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando prioridade não é selecionada", async () => {
        render(<RegisterTask />);

        const prioritySelect = screen.getByLabelText(/prioridade/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(prioritySelect, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/a prioridade é obrigatória/i)).toBeInTheDocument();
        });
    });

    it("Deve mostrar erro quando status não é selecionado", async () => {
        render(<RegisterTask />);

        const statusSelect = screen.getByLabelText(/status/i);
        const submitButton = screen.getByRole("button", { name: /cadastrar/i });

        fireEvent.change(statusSelect, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/o status é obrigatório/i)).toBeInTheDocument();
        });
    });
});