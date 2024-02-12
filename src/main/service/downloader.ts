import { createWriteStream } from "fs";
import { https } from "follow-redirects";

/**
 * Downloads `url` and saves it as`targetFile`
 * @param url			Target URL.
 * @param targetFile	Save path.
 */
export async function download(
	url: string,
	savePath: string,
	maxDownloadRetries: number = 1
): Promise<void> {
	let retryCount = 0;
	while (retryCount < maxDownloadRetries) {
		try {
			await new Promise((resolve, reject) => {
				const stream = createWriteStream(savePath);
				const request = https.get(url, (response) => {
					response.pipe(stream);
					request.on("error", (err) => reject(err));
					stream.on("error", (err) => reject(err));
					stream.on("finish", () => {
						stream.close();
						resolve(null);
					});
				});
			});
			return;
		} catch (err) {
			retryCount++;
			if (retryCount == maxDownloadRetries) {
				throw new Error(
					`Unable to download file: ${url}. Error: ${err}`
				);
			}
		}
	}
}
