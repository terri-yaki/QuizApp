// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import exampleHelper from '../../helpers/exampleHelper';

type Data = {
    name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let x:number = exampleHelper();
    console.log(x);
    res.status(200).json({name: 'John Doe'});
}
