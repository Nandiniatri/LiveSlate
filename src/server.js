import { createServer } from "miragejs";

export function makeServer({ environment = "development" } = {}){
    let server = createServer({
        environment,

        fixtures:{

        },

        routes() {
            this.namespace = "api";

            // this.get("/" , (schema) => {
            //     return schema.db.header;
            // })
        }
    })
}