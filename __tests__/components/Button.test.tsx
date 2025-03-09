import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/app/components/ui/Button'

describe('Button', () => {
  it('deve renderizar o botão com texto correto', () => {
    // Arrange
    render(<Button>Clique Aqui</Button>)
    
    // Act & Assert
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument()
  })

  it('deve aplicar a classe correta baseada na variante', () => {
    // Arrange
    const { rerender } = render(<Button variant="primary">Botão Primário</Button>)
    
    // Act & Assert
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
    
    // Testar outra variante
    rerender(<Button variant="danger">Botão de Perigo</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('deve aplicar o tamanho correto baseado na propriedade size', () => {
    // Arrange
    const { rerender } = render(<Button size="lg">Botão Grande</Button>)
    
    // Act & Assert
    expect(screen.getByRole('button')).toHaveClass('h-12')
    
    // Testar outro tamanho
    rerender(<Button size="sm">Botão Pequeno</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
  })

  it('deve renderizar um ícone quando a propriedade icon for fornecida', () => {
    // Arrange
    render(
      <Button icon={<span data-testid="icon">🔍</span>}>
        Pesquisar
      </Button>
    )
    
    // Act & Assert
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('deve disparar o evento onClick quando clicado', () => {
    // Arrange
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clicável</Button>)
    
    // Act
    fireEvent.click(screen.getByRole('button'))
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve estar desabilitado quando a propriedade disabled for verdadeira', () => {
    // Arrange
    render(<Button disabled>Desabilitado</Button>)
    
    // Act & Assert
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50')
  })
}) 