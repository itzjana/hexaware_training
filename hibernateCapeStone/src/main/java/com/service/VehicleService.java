package com.service;

import com.exception.InvalidOwnershipException;
import com.exception.ResourceNotFoundException;
import com.model.Customer;
import com.model.User;
import com.model.Vehicle;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class VehicleService {

    private final Session session;
    private final CustomerService customerService;

    public VehicleService(Session session) {
        this.session = session;
        customerService = new CustomerService(session);
    }


    public void insert(Vehicle vehicle, User user) {

        vehicle.setCustomer(customerService.getCustomer(user));
        Transaction tx = session.beginTransaction();
        session.persist(vehicle);
        tx.commit();
    }


    public void delete(int id,User user) {
        getbyId(id,user);
        Transaction tx = session.beginTransaction();
        session.createMutationQuery("delete from Vehicle where id=:id")
                .setParameter("id",id)
                .executeUpdate();
        tx.commit();
    }


    public Vehicle getbyId(int id, User user) {
        Transaction tx = session.beginTransaction();
        Vehicle vehicle = session.find(Vehicle.class,id);
        tx.commit();
        if(vehicle == null)
            throw new ResourceNotFoundException("Invalid id");

        Customer customer = customerService.getCustomer(user);

        if(!vehicle.getCustomer().equals(customer))
            throw new InvalidOwnershipException("you dont own this Vehicle");

        return vehicle;

    }

    public void update(Vehicle vehicle,int id) {
        Transaction tx = session.beginTransaction();
        session.merge(vehicle);
        tx.commit();
    }

    public List<Vehicle> getAll(User user) {
        Customer customer = customerService.getCustomer(user);
        Transaction tx = session.beginTransaction();
        List<Vehicle> list = session.createQuery("select v from Vehicle v where v.customer=:cus", Vehicle.class)
                        .setParameter("cus",customer).getResultList();
        tx.commit();
        if(list.isEmpty())
            throw new ResourceNotFoundException("No vehicle available");
        return list;
    }
}
