package rocketboard;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import rocketboardPages.RocketboardPage;

public class EndToEndTests {
	WebDriver driver;
	public static String baseUrl = "http://localhost:3000/";
	public static String serviceUrl = "#6af857bcfaf0a14a2a8ee276ce6c7d4f8a994b2a"; // KEY FROM "TESTUSERTWBR", user created to automated tests

	public String repoCreateIssue = "User Agent";
	public Boolean issueCreated;
	public Boolean issueModalOpened;
	public static String title;
	public static String desc;
	public String project;
	String[] repoUsed = {"userAgent"};

	int[] checkValue = null;
	String selectedOption = "";
	private RocketboardPage RocketboardPage;
	public static String messageSucessRocket="Liftoff! We Have a Liftoff!";
	public static String messageDone="Drop here to launch";
	public static String messageLoading="Please wait...";

	/**
	 * DriverManager instance
	 */
	DriverManager managerDriver = new DriverManager();


	@Before
	public void setUp() throws Exception {

		managerDriver.loadDriver();
		this.driver = managerDriver.getDriver();
		this.driver.get("http://localhost:3000"+ serviceUrl);
		RocketboardPage = PageFactory.initElements(this.driver, RocketboardPage.class);	 

		
		title = "title_"+RandomStringUtils.randomAlphabetic(6);
		desc = "desc_"+RandomStringUtils.randomAlphabetic(6);
	}

	@After
	public void tearDown() {  
		driver.quit();
	}	

	@Test
	public void E2E() throws Exception {
		RocketboardPage.waitingLoading();
		checkValue = RocketboardPage.createIssueGettingValue(title, desc, RocketboardPage.chooseProject());
		RocketboardPage.waitCreatedIssue(title);
		assertEquals(Integer.valueOf(checkValue[0]+1),Integer.valueOf(checkValue[1]));
		RocketboardPage.moveIssue(title, "2");
		RocketboardPage.moveIssue(title, "3");
		RocketboardPage.moveIssue(title, "4");
		RocketboardPage.moveIssue(title, "5");
		Boolean issueLaunched = RocketboardPage.checkIssueLaunched(messageSucessRocket);
		assertThat(issueLaunched, equalTo(Boolean.TRUE));
	}
}