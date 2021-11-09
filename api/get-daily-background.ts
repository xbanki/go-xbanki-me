import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime }                      from 'luxon';

import flatted from 'flatted';
import axios   from 'axios';

/*
 * `api/get-daily-background` returns new png image data from Bing Image Archive, which can
 * be reached from the following URL: https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=fi-FI
 * 
 * We only return some of the data, such as the image source URL and copyright data.
 * 
 * TO-DO(xbanki): HTTP & CORS headers
 * TO-DO(xbanki): Better logging when endpoint is hit for analytics
 */

const ImageArchiveURL = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=fi-FI';
const BingBaseURL     = 'https://bing.com/';

/**
 * Single archive image data.
 * @see {ImageArchiveData}
 */
interface ImageArchiveImage {
    startdate: string;
    fullstartdate: string;
    enddate: string;
    url: string;
    copyright: string;
}

/**
 * Bing Image Archive API data.
 * @see {ImageArchiveImage}
 */
interface ImageArchiveData {
    images: ImageArchiveImage[];
}

export default async function(request: VercelRequest, response: VercelResponse): Promise<void> {

    if (request?.body) {
        response.status(400).send({ status: 400, message: '"/api/get-daily-background" does not take in any body inputs' });
        return;
    }

    /**
     * Bing Image Archive data.
     * @see {ImageArchiveData}
     * @private
     */
    const data: ImageArchiveData | undefined = await axios.get(ImageArchiveURL)
        .then(data => data.data)
        .catch(() => undefined);

    // TO-DO(xbanki): Potential error point. Integrate error log collection
    if (!data || !data?.images[0]) {
        response.status(500).send({ status: 400, message: 'Internal server error occurred, please try again later' });
        return;
    }

    /**
     * First image of the daily images archive which is the only one we care about.
     * @see {ImageArchiveImage}
     */
    const image_data = data.images[0];

    const response_object = {
        data: {
            expires_on: DateTime.fromFormat(image_data.enddate, 'yyyyMMdd'),
            copyright: image_data.copyright,
            url: `${BingBaseURL}${image_data.url}`
        },
        message: 'ok',
        status: 200
    };

    response.status(200).send(flatted.stringify(response_object));
}