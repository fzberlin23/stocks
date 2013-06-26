<?php
namespace Stock\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Stock\Document\Stock;
use Stock\Document\Price;
use Stock\Form\StockForm;

class StockController extends AbstractActionController
{

	protected $stockTable;

	public function homeAction()
	{
	}

	public function githubAction()
	{
	}

	public function indexAction()
    {

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

        $stocks = $dm->createQueryBuilder('Stock\Document\Stock')
			->getQuery()
			->execute();

		foreach ($stocks as $stock) {

			$stock->priceCount = $dm->createQueryBuilder('Stock\Document\Price')
				->field('stock.id')->equals($stock->id)
				->getQuery()
				->execute()
				->count();
		}

        return new ViewModel(array(
           'stocks' => $stocks,
        ));
    }

	public function addAction()
    {
        $form = new StockForm();
        $form->get('submit')->setValue('Add');

        $request = $this->getRequest();
        if ($request->isPost()) {

            $stock = new Stock();
            $form->setInputFilter($stock->getInputFilter());
            $form->setData($request->getPost());

            if ($form->isValid()) {

                $stock->exchangeArray($form->getData());

				$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
				$dm->persist($stock);
				$dm->flush();

                // Redirect to list of stocks
                return $this->redirect()->toRoute('stock');
            }
        }

        return array('form' => $form);
    }

	public function editAction()
    {
        $id = $this->params()->fromRoute('id', 0);
        if (!$id) {
            return $this->redirect()->toRoute('stock', array(
                'action' => 'add'
            ));
        }

        // Get the stock with the specified id.  An exception is thrown
        // if it cannot be found, in which case go to the index page.
        try {
			$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
			$stock = $dm->find('Stock\Document\Stock', $id);
        }
        catch (\Exception $ex) {
            return $this->redirect()->toRoute('stock', array(
                'action' => 'index'
            ));
        }

        $form  = new StockForm();
        $form->bind($stock);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setInputFilter($stock->getInputFilter());
            $form->setData($request->getPost());

            if ($form->isValid()) {
				$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
				$dm->persist($form->getData());
				$dm->flush();

                // Redirect to list of stocks
                return $this->redirect()->toRoute('stock');
            }
        }

        return array(
            'id' => $id,
            'form' => $form,
        );
    }

	public function deleteAction()
    {
        $id = $this->params()->fromRoute('id', 0);
        if (!$id) {
            return $this->redirect()->toRoute('stock');
        }

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

        $request = $this->getRequest();
        if ($request->isPost()) {
            $del = $request->getPost('del', 'No');
            if ($del == 'Ja') {
				$id = $request->getPost('id');
				$qb = $dm->createQueryBuilder('Stock\Document\Stock');
				$qb->remove()
					->field('id')->equals($id)
					->getQuery()
					->execute();
            }

            // Redirect to list of stocks
            return $this->redirect()->toRoute('stock');
        }

		// works
		// $stock = $dm->getRepository('Stock\Document\Stock')->findOneBy(array('id' => $id));

		// works as well
		// $stock = $dm->createQueryBuilder('Stock\Document\Stock')
		//   ->field('id')->equals($id)
		//   ->getQuery()
		//   ->getSingleResult();

		// works as well
		// $stock = $dm->getRepository('Stock\Document\Stock')->findOneById($id);

		// using this one because its the shortest way
		$stock = $dm->find('Stock\Document\Stock', $id);

        return array(
            'id'    => $id,
            'stock' => $stock
        );
    }

	public function easeljsAction()
	{
		$id = $this->params()->fromRoute('id', 0);
        if (!$id) {
            return $this->redirect()->toRoute('stock');
        }

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

		$stock = $dm->find('Stock\Document\Stock', $id);

        return new ViewModel(array(
			'stock' => $stock
        ));
	}

	public function getHistoricalPricesOfStockAction() {

		$id = $this->params()->fromRoute('id', 0);
        if (!$id) {
            return $this->redirect()->toRoute('stock');
        }

		$startYear = '2007';

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

		$stock = $dm->find('Stock\Document\Stock', $id);
		if (is_null($stock)) {
			die('Could not find stock with id ' . $id . ' in mongo db.');
		}

		// remove old prices
		$qb = $dm->createQueryBuilder('Stock\Document\Price');
		$qb->remove()
			->field('stock.id')->equals($stock->getId())
			->getQuery()
			->execute();

		$url =	'http://ichart.finance.yahoo.com/table.csv?' .
				's='.$stock->getSymbol().'&' .											// symbol
				'd='.(((int)date('m')) - 1).'&e='.date('d').'&f='.date('Y').'&g=d&' . 	// bis
				'a=0&b=1&c=' . $startYear . '&' .										// von
				'ignore=.csv';

		try {
			$response = $this->getDataWithCurl($url);
		}
		catch (\Exception $e) {
			die('Beim Herunterladen der Kurse trat ein Fehler ('.$e->getMessage().') auf. Stimmt das Symbol der Aktie ('.$stock->getSymbol().')?');
		}

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

		// Redirect to list of stocks
		return $this->redirect()->toRoute('stock');
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
			throw new \Exception('Unexpected status: ' . substr($output, 0, strpos($output, "\r")));
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

	public function loadPricesAction()
	{
		$id = $this->params()->fromRoute('id', 0);
        if (!$id) {
            return new JsonModel(array(
				'success' => false
			));
        }

		$days = $this->params()->fromRoute('days', 0);
        if (!$days) {
            return new JsonModel(array(
				'success' => false
			));
        }

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

		$cursor = $dm->createQueryBuilder('Stock\Document\Price')
			->select('date', 'open', 'high', 'low', 'close')
			->field('stock.id')->equals($id)
			->limit($days + 30 - 1)
			->sort('date', 'desc')
			->getQuery()
			->execute();

		$result = array();
		foreach ($cursor as $price) {
			$result[] = $price;
		}

		return new JsonModel(array(
			'success' => true,
			'prices' => $result
        ));
	}

}