import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function(request: VercelRequest, response: VercelResponse): Promise<void> {
    response.status(200).json({ message: 'Hello World' });
}