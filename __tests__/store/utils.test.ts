import { generateId } from '@/app/store/utils';

describe('Store Utilities', () => {
  describe('generateId', () => {
    it('deve gerar um ID único', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      // Verificar que os IDs são strings
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      
      // Verificar que os IDs são diferentes
      expect(id1).not.toEqual(id2);
      
      // Verificar comprimento do ID
      expect(id1.length).toBeGreaterThan(5);
    });
  });
}); 