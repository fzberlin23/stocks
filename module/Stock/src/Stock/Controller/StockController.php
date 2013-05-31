<?php
namespace Stock\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

use Stock\Document\Price;

class StockController extends AbstractActionController
{

	protected $stockTable;

	public function homeAction()
	{
	}

	public function indexAction()
    {

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

        $stocks = $dm->createQueryBuilder('Stock\Document\Stock')
			->getQuery()
			->execute();

        return new ViewModel(array(
           'stocks' => $stocks,
        ));
    }

	public function easeljsAction()
	{

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

		$prices = $dm->createQueryBuilder('Stock\Document\Price')
			->select('date', 'open', 'high', 'low', 'close')
			->limit(20)
			->sort('date', 'desc')
			->getQuery()
			->execute();

        return new ViewModel(array(
           'prices' => $prices,
        ));
	}

	public function getHistoricalPricesOfStockAction() {

		// set max_execution_time
		ini_set('max_execution_time', 0);

		$symbol = '^GDAXI';
		$startYear = '2003';

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

		$stock = $dm->getRepository('Stock\Document\Stock')->findOneBy(array('symbol' => $symbol));
		if (is_null($stock)) {
			die('Could not find stock with symbol ' . $symbol . ' in mongo db.');
		}

		// remove old prices
		$qb = $dm->createQueryBuilder('Stock\Document\Price');
		$qb->remove()
			->field('stock.id')->equals($stock->getId())
			->getQuery()
			->execute();

		$url =	'http://ichart.finance.yahoo.com/table.csv?' .
				's='.$symbol.'&' .														// symbol
				'd='.(((int)date('m')) - 1).'&e='.date('d').'&f='.date('Y').'&g=d&' . 	// bis
				'a=0&b=1&c=' . $startYear . '&' .										// von
				'ignore=.csv';

		$response = $this->getDataWithCurl($url);

		$data = $this->parseHistoricalPrices($response);

		foreach ($data as $var) {

			$price = new Price();
			$price->setStock($stock);
			$price->setDate($var['date']);
			$price->setOpen($var['open']);
			$price->setHigh($var['high']);
			$price->setLow($var['low']);
			$price->setClose($var['close']);
			$dm->persist($price);
		}

		$dm->flush();

		die('done');
	}

	/**
	 * Gets data with curl
	 *
	 * @param string $url
	 * @return string
	 * @throws Exception
	 */
	private function getDataWithCurl($url) {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
		curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);

		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);

		$headers = array("Pragma: no-cache");
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$output = curl_exec($ch);

		// connection error or something?
		if ($output === false) {

			// log curl error
			$error = curl_error($ch);
			curl_close($ch);

			throw new Exception($error);
		}

		// unexpected status?
		if (substr($output, 0, strpos($output, "\r")) != 'HTTP/1.1 200 OK') {

			// log status error
			curl_close($ch);
			throw new Exception('Unexpected status: ' . substr($output, 0, strpos($output, "\r")));
		}

		return trim(substr($output, strpos($output, "\r\n\r\n")));
	}

	/**
	 * Parses the historical prices csv file from yahoo
	 *
	 * @param string $csvData
	 * @return array
	 */
	private function parseHistoricalPrices($csvData) {

		$finalData = array();

		$tmp = explode("\n", $csvData);
		foreach ($tmp as $key => $var) {

			if ($key == 0)
				continue;

			$dataOfDay = explode(',', trim($var));

			$finalData[] = array(
				'date' => $dataOfDay[0],
				'open' => $dataOfDay[1],
				'high' => $dataOfDay[2],
				'low' => $dataOfDay[3],
				'close' => $dataOfDay[4],
				'volume' => $dataOfDay[5]
			);
		}

		return $finalData;
	}

}