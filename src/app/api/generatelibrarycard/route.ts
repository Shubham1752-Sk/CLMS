import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req: { body: any; }, res: { setHeader: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: Uint8Array): void; new(): any; }; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  try {

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    const userData = req.body; 

    await page.setContent(`
      <html>
        <head>
          <link rel="stylesheet" href="/styles.css"> <!-- Include any relevant CSS files -->
        </head>
        <body>
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1>Library Card for ${userData.name}</h1>
            <p>Email: ${userData.email}</p>
            <p>Role: ${userData.role}</p>
            <p>Card ID: ${userData.id}</p>
          </div>
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Library_Card_${userData.name}.pdf`);
    res.status(200).send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
