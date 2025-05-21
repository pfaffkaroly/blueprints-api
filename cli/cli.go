package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
)

const baseURL = "http://localhost:3000/blueprints"

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Expected 'create', 'get', 'list', 'update', or 'delete' subcommands")
		os.Exit(1)
	}

	switch os.Args[1] {
	case "create":
		createCmd := flag.NewFlagSet("create", flag.ExitOnError)
		file := createCmd.String("file", "", "Path to JSON file")
		createCmd.Parse(os.Args[2:])
		if *file == "" {
			fmt.Println("--file is required")
			os.Exit(1)
		}
		createBlueprint(*file)

	case "get":
		getCmd := flag.NewFlagSet("get", flag.ExitOnError)
		id := getCmd.String("id", "", "Blueprint ID")
		getCmd.Parse(os.Args[2:])
		if *id == "" {
			fmt.Println("--id is required")
			os.Exit(1)
		}
		getBlueprint(*id)

	case "list":
		listBlueprints()

	case "update":
		updateCmd := flag.NewFlagSet("update", flag.ExitOnError)
		id := updateCmd.String("id", "", "Blueprint ID")
		file := updateCmd.String("file", "", "Path to JSON file")
		updateCmd.Parse(os.Args[2:])
		if *id == "" || *file == "" {
			fmt.Println("--id and --file are required")
			os.Exit(1)
		}
		updateBlueprint(*id, *file)

	case "delete":
		deleteCmd := flag.NewFlagSet("delete", flag.ExitOnError)
		id := deleteCmd.String("id", "", "Blueprint ID")
		deleteCmd.Parse(os.Args[2:])
		if *id == "" {
			fmt.Println("--id is required")
			os.Exit(1)
		}
		deleteBlueprint(*id)

	default:
		fmt.Println("Unknown subcommand")
		os.Exit(1)
	}
}

func createBlueprint(file string) {
	body, err := os.ReadFile(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}
	res, err := http.Post(baseURL, "application/json", bytes.NewBuffer(body))
	printResponse(res, err)
}

func getBlueprint(id string) {
	res, err := http.Get(baseURL + "/" + id)
	printResponse(res, err)
}

func listBlueprints() {
	res, err := http.Get(baseURL)
	printResponse(res, err)
}

func updateBlueprint(id, file string) {
	body, err := os.ReadFile(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}
	req, err := http.NewRequest(http.MethodPut, baseURL+"/"+id, bytes.NewBuffer(body))
	if err != nil {
		fmt.Println("Request creation failed:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	res, err := client.Do(req)
	printResponse(res, err)
}

func deleteBlueprint(id string) {
	req, err := http.NewRequest(http.MethodDelete, baseURL+"/"+id, nil)
	if err != nil {
		fmt.Println("Request creation failed:", err)
		return
	}
	client := &http.Client{}
	res, err := client.Do(req)
	printResponse(res, err)
}

func printResponse(res *http.Response, err error) {
	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)

	var pretty bytes.Buffer
	if json.Valid(body) {
		if err := json.Indent(&pretty, body, "", "  "); err == nil {
			fmt.Printf("Status: %s\nResponse:\n%s\n", res.Status, pretty.String())
			return
		}
	}

	fmt.Printf("Status: %s\nResponse: %s\n", res.Status, string(body))
}
