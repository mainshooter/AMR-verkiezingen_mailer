const mailer = require("./mailer");
const Database = require("./database");
const config = require("./config");

(async function() {

  let db = new Database();
  await db.setup(config.db);

  if (await db.run("SHOW TABLES LIKE ?", ["receivers"]) == false) {
    // Create database
    await db.run("CREATE TABLE `receivers` (`id` int(11) NOT NULL,`name` text NOT NULL,`mail` text NOT NULL,`is_send` tinyint(1) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
    await db.run("ALTER TABLE `receivers`ADD PRIMARY KEY (`id`);");
    await db.run("ALTER TABLE `receivers`MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;");
  }

  setInterval(async () => {
    let mails = await db.run("SELECT * FROM receivers WHERE is_send = 0 LIMIT 1");

    await mails.forEach(async (mail) => {
      await mailer(mail["mail"], config.subject, config.html);
      await db.run("UPDATE receivers SET is_send = 1 WHERE mail = ?", [mail['mail']]);

    });
  }, config.intervalTimer);

})();
