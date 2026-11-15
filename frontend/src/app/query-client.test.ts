import { expect, it } from 'vitest';
import { createQueryClient } from './query-client';

it('does not retry failed writes', async () => {
  const client = createQueryClient();
  let submissions = 0;
  const mutation = client.getMutationCache().build(client, {
    mutationFn: async () => { submissions += 1; throw new Error('unavailable'); },
  });
  await expect(mutation.execute(undefined)).rejects.toThrow('unavailable');
  expect(submissions).toBe(1);
  client.clear();
});
